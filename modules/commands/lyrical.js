const axios = require("axios");

module.exports.config = {
  name: "lyrics",
  version: "1.0.0",
  hasPermission: 0,
  credits: "OpenAPI",
  description: "Fetch song lyrics based on artist and song title",
  usePrefix: false,
  commandCategory: "Search",
  usages: "lyrical <artist> <song>",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const [artist, ...songParts] = args;
  const song = songParts.join(" ");

  if (!artist || !song) {
    return api.sendMessage(
      "Please provide both artist and song title.",
      threadID,
      messageID,
    );
  }

  try {
    const response = await axios.get(
      `https://openapi-idk8.onrender.com/lyrical/find?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`,
    );

    const {
      api_name,
      description,
      artist: foundArtist,
      song: foundSong,
      lyrics,
    } = response.data;

    if (!lyrics) {
      return api.sendMessage(
        `Lyrics not found for ${artist} - ${song}.`,
        threadID,
        messageID,
      );
    }

    const msg = {
      body: `Lyrics for ${foundArtist} - ${foundSong}:\n\n${lyrics}`,
    };

    api.sendMessage(msg, threadID, messageID);
  } catch (error) {
    console.error("Error:", error.message);
    api.sendMessage(
      `Failed to fetch lyrics: ${error.message}`,
      threadID,
      messageID,
    );
  }
};
