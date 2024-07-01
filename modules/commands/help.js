module.exports.config = {
  name: "help",
  version: "1.0.2",
  hasPermission: 0,
  credits: "Mirai Team & Mod by Yan Maglinte",
  description: "Beginner's Guide",
  usePrefix: true,
  commandCategory: "guide",
  usages: "[Shows Commands]",
  cooldowns: 10,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60,
  },
};

module.exports.languages = {
  en: {
    moduleInfo:
      "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 ",
    helpList: `◖There are %1 commands and %2 categories on this bot.`,
    guideList: `◖Use: "%1${this.config.name} ‹command›" to know how to use that command!\n◖Type: "%1${this.config.name} ‹page_number›" to show that page contents!`,
    user: "User",
    adminGroup: "Admin group",
    adminBot: "Admin bot",
  },
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase()))
    return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;
  const usage = command.config.usePrefix
    ? `${prefix}${command.config.name} ${command.config.usages || ""}`
    : command.config.usages || "";

  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      usage,
      command.config.commandCategory,
      command.config.cooldowns,
      command.config.hasPermission === 0
        ? getText("user")
        : command.config.hasPermission === 1
          ? getText("adminGroup")
          : getText("adminBot"),
      command.config.credits,
    ),
    threadID,
    messageID,
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;

  if (!command) {
    const commandList = Array.from(commands.values());
    const categories = new Set(
      commandList.map((cmd) => cmd.config.commandCategory.toLowerCase()),
    );
    const categoryCount = categories.size;

    const categoryNames = Array.from(categories);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(categoryNames.length / itemsPerPage);

    let currentPage = 1;
    if (args[0]) {
      const parsedPage = parseInt(args[0]);
      if (!isNaN(parsedPage) && parsedPage >= 1 && parsedPage <= totalPages) {
        currentPage = parsedPage;
      } else {
        return api.sendMessage(
          `◖Oops! You went too far! Please choose a page between 1 and ${totalPages}◗`,
          threadID,
          messageID,
        );
      }
    }
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleCategories = categoryNames.slice(startIdx, endIdx);

    let msg = "";
    for (let i = 0; i < visibleCategories.length; i++) {
      const category = visibleCategories[i];
      const categoryCommands = commandList.filter(
        (cmd) => cmd.config.commandCategory.toLowerCase() === category,
      );
      const commandNames = categoryCommands.map((cmd) => cmd.config.name);
      const numberFont = ["❶", "❷", "❸", "❹", "❺", "❻", "❼", "❽", "❾", "❿"];
      msg += `[ ${numberFont[i]} ] ${category.charAt(0).toUpperCase() + category.slice(1)}: ${commandNames.join(", ")}\n\n`;
    }

    const numberFontPage = [
      "❶",
      "❷",
      "❸",
      "❹",
      "❺",
      "❻",
      "❼",
      "❽",
      "❾",
      "❿",
      "⓫",
      "⓬",
      "⓭",
      "⓮",
      "⓯",
      "⓰",
      "⓱",
      "⓲",
      "⓳",
      "⓴",
    ];
    msg += `Page ${numberFontPage[currentPage - 1]} of ${numberFontPage[totalPages - 1]}\n`;
    msg += getText("helpList", commands.size, categoryCount, prefix);

    const axios = require("axios");
    const fs = require("fs-extra");
    const imgP = [];
    const img = [
      "https://i.imgur.com/ruQ2pRn.jpg",
      "https://i.imgur.com/HXHb0cB.jpg",
      "https://i.imgur.com/ZJEI6KW.jpg",
      "https://i.imgur.com/XGL57Wp.jpg",
      "https://i.imgur.com/6OB00HJ.jpg",
      "https://i.imgur.com/6vHaRZm.jpg",
      "https://i.imgur.com/k6uE93k.jpg",
    ];
    const path = __dirname + "/cache/menu.png";
    const rdimg = img[Math.floor(Math.random() * img.length)];

    const { data } = await axios.get(rdimg, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(path, Buffer.from(data, "utf-8"));
    imgP.push(fs.createReadStream(path));
    const config = require("./../../config.json");
    const msgg = {
      body:
        `『 Command & Category 』\n‣ Bot Owner: ${config.DESIGN.Admin}\n\n` +
        msg +
        `\nTotal pages available: ${totalPages}.\n` +
        `\nGUIDE\n` +
        getText("guideList", config.PREFIX),
      attachment: imgP,
    };

    const sentMessage = await api.sendMessage(msgg, threadID, messageID);

    if (autoUnsend) {
      setTimeout(async () => {
        await api.unsendMessage(sentMessage.messageID);
      }, delayUnsend * 1000);
    }
  } else {
    const usage = command.config.usePrefix
      ? `${prefix}${command.config.name} ${command.config.usages || ""}`
      : command.config.usages || "";
    return api.sendMessage(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        usage,
        command.config.commandCategory,
        command.config.cooldowns,
        command.config.hasPermission === 0
          ? getText("user")
          : command.config.hasPermission === 1
            ? getText("adminGroup")
            : getText("adminBot"),
        command.config.credits,
      ),
      threadID,
      messageID,
    );
  }
};
