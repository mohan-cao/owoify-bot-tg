// Dependencies
const axios = require('axios');
const inspect = require('util').inspect;

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
  command = commands.reduce((x, y) => command.indexOf(y) >= 0 && command || x, false);
  if (isBot || !command) {
    // discriminate against bot-kind and losers who cant command
    console.log("Command not supported:", command);
    statusOWOK(res);
    return;
  }
  const responseText = owoify(text, command);
  console.log("Your owoified text is:", responseText);
  axios.post(`${url}${apiToken}/sendMessage`, {
    chat_id: chatId,
    text: responseText + ""
  })
  .then((response) => {
    res.status(200).send(response);
  }).catch((error) => {
    console.error("Broke", inspect(error));
    res.send(error);
  });
}

function hewwo(chatId, res) {
  axios.post(`${url}${apiToken}/sendMessage`, {
    chat_id: chatId,
    text: 'hewwo! im owoify bot!\nOwO *notices ur buldge* whats this??'
  })
  .then((response) => {
    res.status(200).send(response);
  }).catch((error) => {
    res.send(error);
  });
}

function statusOWOK(res) {
  res.status(200).send({});
}

function owoify(v, level="owo") {
  let faces = ["(・`ω´・)",";;w;;","owo","UwU",">w<","^w^","(* ^ ω ^)","(⌒ω⌒)","ヽ(*・ω・)ﾉ","(o´∀`o)","(o･ω･o)","＼(＾▽＾)／"];
  // HAHAHA I CAN FINALLY JUSTIFY SWITCH STATEMENTS NOW
  // Yeah I know I can use a reducer but this is so much more funny to impwement
  switch (level) {
    case "uvu":
      v = v.replace(/o/g, ()=>Math.round(Math.random())?"owo":"o");
      v = v.replace(/ew/g, "uwu");
      v = v.replace(/([Hh])ey/g, "$1ay");
      v = v.replace(/dead/g, "ded");
    case "uwu":
      v = v.replace(/[({<]/g, "｡･:*:･ﾟ★,｡･:*:･ﾟ☆");
      v = v.replace(/[)}>]/g, "☆ﾟ･:*:･｡,★ﾟ･:*:･｡");
      v = v.replace(/[.,](?![0-9])/g, ()=>(" " + faces[Math.floor(Math.random()*faces.length)]));
      v = v.replace(/[!;]+/g, ()=>(" " + faces[Math.floor(Math.random()*faces.length)]));
      v = v.replace(/that/g, "dat"); // stop correcting that to fat
      v = v.replace(/That/g, "Dat");
      v = v.replace(/[Tt]h(?![Ee])/g, "f");
      v = v.replace(/TH(?!E)/g, "F");
      v = v.replace(/le/g, 'wal');
      v = v.replace(/ve/g, 'we');
      v = v.replace(/Ve/g, 'We');
      v = v.replace(/ry/g, 'wwy');
      v = v.replace(/(?:r|l)/g, "w");
      v = v.replace(/(?:R|L)/g, "W");
    case "owo":
      v = v.replace(/ll/g, "ww");
      v = v.replace(/[aeiour]l/g, "wl");
      v = v.replace(/[AEIOUR]([lL])/g, "W$1");
      v = v.replace(/[aeiour]o/g, "wo");
      v = v.replace(/[AEIOUR]([oO])/g, "W$1");
      v = v.replace(/([Oo])ld/g, '$1ld');
      v = v.replace(/OLD/g, 'OLD');
      v = v.replace(/[vw]le/g, "wal");
      v = v.replace(/([Ff])i/g, "$1wi");
      v = v.replace(/FI/g, "FWI");
      v = v.replace(/([Vv])er/g, "wer");
      v = v.replace(/([Pp])oi/g, "$1woi");
      v = v.replace(/([DdFfGgHhJjPpQqRrSsTtXxYyZz])le/g, "$1wal");
    default:
      v = v.replace(/([Ff])uc/g, "$1wuc");
      v = v.replace(/([Mm])om/g, "$1wom");
      v = v.replace(/([Mm])e/g, "$1we");
      v = v.replace(/n([aeiou])/g, 'ny$1');
      v = v.replace(/N([aeiou])/g, 'Ny$1');
      v = v.replace(/N([AEIOU])/g, 'NY$1');
      v = v.replace(/ove/g, "uv");
      v = v.replace(/OVE/g, "UV");
      v = v.replace(/\b(ha|hah|heh|hehe)+\b/g, 'hehe xD');
      break;
  }
  return v;
}

module.exports = app;
