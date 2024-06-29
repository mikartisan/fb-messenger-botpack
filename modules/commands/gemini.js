const { get } = require("axios");

module.exports.config = {
  name: "gemini",
  credits: "Hanni",
  version: "1.0.0",
  role: 0,
  hasPermission: 0,
  aliases: ["Gemini"],
  cooldowns: 0,
  usePrefix: false,
  description: "Responds to questions using Gemini AI model",
  usages: "gemini <Your_questions>",
  commandCategory: "chatbots",
};

module.exports.run = async function ({ api, event, args, box }) {
  const question = args.join(" ");

  function sendMessage(msg) {
    api.sendMessage(msg, event.threadID, event.messageID);
  }

  if (!question) {
    box.react("⏱️", event.messageID);
    return sendMessage("Please provide a question.");
  }

  // React to the user's message with an emoji
  api.setMessageReaction("⏳", event.messageID, (err) => {
    if (err) console.error(err);
  });

  // Send a message indicating that the response is being generated
  sendMessage("Fetching answer...");

  try {
    const response = await get(
      `https://openapi-idk8.onrender.com/aichat?query=${encodeURIComponent(question)}`,
    );
    sendMessage(response.data.response);
  } catch (error) {
    sendMessage("An error occurred: " + error.message);
  }
};
