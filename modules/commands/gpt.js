const { get } = require("axios");

module.exports.config = {
  name: "gpt",
  credits: "Hanni",
  version: "1.0.0",
  role: 0,
  hasPermision: 0,
  aliases: ["Gpt"],
  cooldown: 0,
  hasPrefix: false,
  description: "Responds to questions using GPT-3.5 Turbo-16k.",
  usage: "<Your_questions>",
  cooldowns: 0,
  usePrefix: false,
  usages: "gpt <Your_questions>",
  commandCategory: "chatbots",
};

module.exports.run = async function ({ api, event, args }) {
  const question = args.join(" ");

  const model = ["v3", "v3-32k", "turbo-16k", "gemini"];
  const category = model[Math.floor(Math.random() * model.length)];

  function sendMessage(msg) {
    api.sendMessage(msg, event.threadID, event.messageID);
  }

  if (!question) return sendMessage("Please provide a question.");

  try {
    const response = await get(
      `https://hercai.onrender.com/${category}/hercai?question=${encodeURIComponent(question)}`,
    );
    sendMessage(response.data.reply);
  } catch (error) {
    sendMessage("An error occurred: " + error.message);
  }
};
