let express = require('express');
let router = express.Router();
let user = require('../db').import('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

router.post('/signup', function (req, res)
{
    user.create({
        username: req.body.user.username,
        password: bcrypt.hashSync(req.body.user.password, 13),
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        birthday: req.body.user.birthday,
    })
    .then(
        function createSuccessful(user) {
            let token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
            let id= user.id;
            
            res.json({
                user: user,
                message: 'User successfully created',
                sessionToken: token,
                ID: id
            });
        }
    )
    .catch(err => res.status(500).json({ error: err }))
});

router.post('/login', function(req, res) {

    user.findOne(
        {where:{
            username: req.body.user.username
        }
    })
    .then(function loginSuccess(user) {
        if (user) {
            bcrypt.compare(req.body.user.password, user.password, function (err, matches) {
                if (matches) {

            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24 })
            let id = user.id

            res.status(200).json({
                user: user,
                message: "User successfully logged in!",
                sessionToken: token,
                ID: id
            })
        } else {
            res.status(502).send({error: "Login Failed"});
        }
        });
    } else {
            res.status(500).json({ error: "User does not exist."})
        }
    })
    .catch(err => res.status(500).json({ error: err }))
});

module.exports = router
