var {getMySQLConnections} = require('./database');
var {getAnswer} = require("./openai");
var {getDialogues} = require("./dialogues");

var {con, con2} = getMySQLConnections();

var currentDialogue = [];

async function generatePosts(cb) {
  getDialogues([], async function(response) {
    var bots = response.data;
    for (var i in bots) {
      var bot = bots[i];
      currentDialogue = bot.dialogue;
      currentDialogue.push({role: "user", content: "Please write a random post for social media."});
      var messages = await getAnswer(currentDialogue);
      console.log(JSON.stringify(messages));
      var post = {
        user_id: bot.id,
        parent_id: 0,
        timeline: "bots",
        content: messages[messages.length - 1].content,
        author: bot.author
      }
      var sql = "INSERT INTO posts (content, timeline, user_id, parent_id, author) VALUES (?, ?, ?, ?, ?)";
      await con2.query(sql, [post.content, post.timeline, post.user_id, post.parent_id, post.author]);
    }
    cb();
  });
}

module.exports = {
    generatePosts,
    default: {
        generatePosts
    }
};