let express = require('express');
let router = express.Router();
let comment = import('./models/comments.js');
let Comment = require('../db').import('../models/comments');
let validateSession = require('../Middleware/validate-session')

router.post('/comment', validateSession, (req, res) => {
    const commentEntry = {
        owner_id: req.user.id,
        comment: req.body.comment.comment
    }
    Comment.create(commentEntry)
      .then(comment => res.status(200).json(comment))
      .catch(err => res.status(500).json({ error: err }))
  })

  router.delete('/:id', validateSession, function (req, res) {
    const query = {where: { id: req.params.id, owner_id: req.user.id}};

    Comment.destroy(query)
    .then(() => res.status(200).json({message: "Comment has been removed"}))
    .catch((err) => res.status(500).json({error: err}))
})

router.put('/update/:id', validateSession, function (req, res)
{
  const updateComment = {
    owner_id: req.user.id,
    comment: req.body.comment.comment
  };
  
  const query = { where: { id: req.params.id, owner_id: req.user.id} };
  Comment.update(updateComment, query)
    .then((comments) => res.status(200).json(comments))
    .catch((err) => res.status(500).json({ error: err }));  
});

module.exports = router