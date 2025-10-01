var OpenAI = require("openai");
var secretConfig = require("../secret-config");

var openai = getOpenAI();

function getOpenAI() {
    const openai = new OpenAI({
        apiKey: secretConfig.API_KEY,
    });
    return openai;
}

async function getAnswer(messages) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    })
    console.log(completion.choices[0].message);
    var message = completion.choices[0].message;
    messages.push(message);
    return messages;
  } catch(err) {
    if (err.status == 429) {
      console.log("Too many requests.");
      await new Promise(r => setTimeout(r, 60000));
      return await getAnswer(messages);
    }
    console.log(err.message);
  }
}

module.exports = {
    getOpenAI,
    getAnswer,
    default: {
        getOpenAI,
        getAnswer
    }
};