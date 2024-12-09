import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

// Helper function to run Python script and get output
async function runPythonAgent(message: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create a Python process
    const pythonProcess = spawn('python', ['-c', `
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.yfinance import YFinanceTools

def format_company_info(message):
    # Add markdown formatting instructions
    formatted_message = f"""
Please format the response as follows:
1. Start with a clear header using markdown
2. Present numerical data in tables where appropriate
3. Use bullet points for key highlights
4. Use proper markdown headers for sections
5. Format currency values consistently
6. Separate different sections clearly

{message}
"""
    return formatted_message

finance_agent = Agent(
    name="Finance Agent",
    model=OpenAIChat(id="gpt-4o-mini"),
    tools=[YFinanceTools(
        stock_price=True, 
        analyst_recommendations=True, 
        company_info=True, 
        company_news=True
    )],
    instructions=[
        "Always format responses in clean markdown",
        "Use tables to display numerical data",
        "Use bullet points for lists",
        "Format currency with 2 decimal places",
        "Use proper headers for different sections",
        "Make the output visually organized"
    ],
    show_tool_calls=True,
    markdown=True,
)

formatted_message = format_company_info("${message}")
response = finance_agent.run(formatted_message)
print(response.content)
`]);

    let output = '';
    let error = '';

    // Collect output
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Python process failed: ${error}`));
      }
    });
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { symbol, analysisType } = body;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Stock symbol is required' },
        { status: 400 }
      );
    }

    // Construct appropriate message based on analysis type
    let message = '';
    switch (analysisType) {
      case 'recommendations':
        message = `Get the latest analyst recommendations for ${symbol}`;
        break;
      case 'price':
        message = `Get the current price and key metrics for ${symbol}`;
        break;
      case 'info':
        message = `Get company information and fundamentals for ${symbol}`;
        break;
      case 'news':
        message = `Get the latest important news for ${symbol}`;
        break;
      default:
        message = `Get a comprehensive analysis for ${symbol}`;
    }

    // Run the Phidata agent and get response
    const response = await runPythonAgent(message);

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Finance agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 