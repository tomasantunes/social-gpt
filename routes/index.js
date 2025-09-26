var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  if(req.session.isLoggedIn) {
    res.redirect('/user-timeline');
  }
  else {
    res.redirect('/login');
  }
});

module.exports = router;
