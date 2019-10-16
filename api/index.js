// Dependencies
const axios = require('axios');
const CircularJSON = require('circular-json');
const owoify = require('owoify-js').default;

const url = 'https://api.telegram.org/bot';

const apiToken = process.env.TELEGRAM_TOKEN;

// Endpoints
const app = (req, res) => {
  if (!req.body.message) {
    console.log("Not a message!", req.body);
    statusOWOK(res);
    return;
  }
  const msg = req.body.message;
  const chatId = msg.chat.id;
  const sentMessage = msg.text || "";
  const isBot = !!msg.from.is_bot;
  const msgCommand = msg.hasOwnProperty("entities") && msg.entities.length >= 0 && msg.entities[0].type === 'bot_command' && msg.entities[0];
  console.log("Ping for new message!")
  // Regex for hello
  if (sentMessage.match(/hello/gi)) {
    hewwo(chatId, res);
  } else if (msgCommand) {
    // if no hello present, handle commands
    const { length, offset } = msg.entities[0];
    const command = sentMessage.slice(offset + 1, length).trim();
    const parsedCommandInput = sentMessage.slice(length).trim();
    console.log("Handle command", command, parsedCommandInput);
    handwalfunkshun(chatId, command, parsedCommandInput, isBot, req, res);
  } else {
    console.log("Not something I can handle? :3", sentMessage, msgCommand);
    statusOWOK(res);
  }
};

/*
 * Functions go below
 */

function handwalfunkshun(chatId, command, text, isBot, req, res) {
  const commands = ["owo", "uwu", "uvu"];
  let parsed_command = commands.reduce((x, y) => command.indexOf(y) >= 0 && y || x, false);
  if (isBot || !parsed_command) {
    // discriminate against bot-kind and losers who cant command
    console.log("Command not supported:", command);
    statusOWOK(res);
    return;
  }
  const responseText = owoify(text, parsed_command);
  if (!responseText || !responseText.trim()) {
    console.log("Nowofied text :(");
    statusOWOK(res);
    return;
  }
  console.log("Your owoified text is:", responseText);

  axios.post(`${url}${apiToken}/sendMessage`, {
    chat_id: chatId,
    text: responseText + ""
  })
  .then((response) => {
    res.status(200).send(CircularJSON.stringify(response));
  }).catch((error) => {
    console.error("Broke", error);
    res.send(error);
  });
}

function hewwo(chatId, res) {
  axios.post(`${url}${apiToken}/sendMessage`, {
    chat_id: chatId,
    text: 'hewwo! im owoify bot!\nOwO *notices ur buldge* whats this??'
  })
  .then((response) => {
    res.status(200).send(CircularJSON.stringify(response));
  }).catch((error) => {
    res.send(error);
  });
}

function statusOWOK(res) {
  res.status(200).send({});
}

module.exports = app;
