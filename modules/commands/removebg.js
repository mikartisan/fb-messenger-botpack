module.exports.config = {
  name: 'removebg',
  version: '1.1.1',
  hasPermission: 0,
  credits: '𝙉𝘼𝙐𝙂𝙃𝙏𝙔 𝘽𝙍𝘼𝙉𝘿',
  description: 'Edit photo',
  commandCategory: 'Tools',
  usePrefix: false,
  usages: 'Reply images or url images',
  cooldowns: 2,
  dependencies: {
    'form-data': '',
    'image-downloader': ''
  }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');

module.exports.run = async function ({ api, event, args }) {
  try {
    let content = '';
    if (event.type === 'message_reply' && event.messageReply.attachments && event.messageReply.attachments[0].type === 'photo') {
      content = event.messageReply.attachments[0].url;
    } else if (args.length > 0) {
      content = args.join(' ');
    } else {
      return api.sendMessage('𝙔𝙤𝙪 𝙈𝙪𝙨𝙩 𝙍𝙚𝙥𝙡𝙮 𝙏𝙤 𝙖 𝙋𝙝𝙤𝙩𝙤 𝙤𝙧 𝙋𝙧𝙤𝙫𝙞𝙙𝙚 𝙖 𝙐𝙍𝙇', event.threadID, event.messageID);
    }

    const Naughtyapis = ["2scVxQKazEt1k1FU4sWx5WoK", "1VfYkFvnpNpyEXvYF76cf9QR"];
    const inputPath = path.resolve(__dirname, 'cache', 'photo.png');

    await image({ url: content, dest: inputPath });

    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

    axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': Naughtyapis[Math.floor(Math.random() * Naughtyapis.length)]
      },
      encoding: null
    })
    .then((response) => {
      if (response.status !== 200) {
        console.error('Error:', response.status, response.statusText);
        return api.sendMessage('𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙧𝙚𝙢𝙤𝙫𝙚 𝙗𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙.', event.threadID, event.messageID);
      }
      fs.writeFileSync(inputPath, response.data);
      return api.sendMessage({ attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));
    })
    .catch((error) => {
      console.error('𝙎𝙚𝙧𝙫𝙚𝙧 𝙁𝙖𝙞𝙡. 𝙎𝙩𝙖𝙮 𝙒𝙞𝙩𝙝 𝙐𝙨 𝙄𝙩 𝙒𝙞𝙡𝙡 𝘽𝙚 𝙁𝙞𝙭𝙚𝙙 𝙎𝙤𝙤𝙣.', error);
      return api.sendMessage('𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙧𝙚𝙢𝙤𝙫𝙚 𝙗𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙.', event.threadID, event.messageID);
    });
  } catch (e) {
    console.log(e);
    return api.sendMessage('𝘾𝙝𝙖𝙣𝙜𝙚𝙞𝙣𝙜 𝙀𝙫𝙚𝙧𝙮𝙩𝙝𝙞𝙣𝙜 𝙄𝙨 𝙉𝙤𝙩 𝙂𝙤𝙤𝙙', event.threadID, event.messageID);
  }
};
