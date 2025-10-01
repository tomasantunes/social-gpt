var express = require('express');
var router = express.Router();
var {getMySQLConnections} = require("../libs/database");
var {generatePosts} = require("../libs/timeline");

var {con, con2} = getMySQLConnections();

router.get('/api/get-bots-timeline', async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.json({status: "NOK", error: "Invalid Authorization."});
    return;
  }
  generatePosts(function() {
    var sql = "SELECT * FROM posts WHERE timeline = 'bots' ORDER BY id DESC";
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        res.json({status: "NOK", error: err.message});
      }
      res.json({status: "OK", data: result});
    });
  });
});

module.exports = router;