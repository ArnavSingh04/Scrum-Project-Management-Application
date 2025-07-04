const express = require('express');
const router = express.Router();

router.get('/mainLoginPage', (req, res) => res.render('admain_login.html'));
router.get('/mainLoginPage',(req,res) => res.render('index.html'));
router.get('/admin_homepage',(req,res) => res.render('creat_user.html'));
router.get('/backlog',(req,res) => res.render('projects.html'));
//router.get('/',(req,res) => res.render('.html'));

module.exports = router;
