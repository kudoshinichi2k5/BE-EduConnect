const { OpenRouter } = require("@openrouter/sdk");
require("dotenv").config();

async function main() {
  const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
  });

  // Gửi request dạng stream
  const stream = await openrouter.chat.send({
    model: "allenai/olmo-3.1-32b-think:free",
    messages: [
      {
        role: "user",
        content: "How many r's are in the word 'strawberry'?"
      }
    ],
    stream: true,
    streamOptions: {
      includeUsage: true
    }
  });

  let response = "";

  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;

    if (content) {
      response += content;
      process.stdout.write(content);
    }

    // Reasoning tokens xuất hiện ở chunk cuối
    if (chunk.usage) {
      console.log("\nReasoning tokens:", chunk.usage.reasoningTokens);
    }
  }
}

main();