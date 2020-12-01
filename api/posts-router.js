const express = require('express');
const Post = require('../data/db');

const router = express.Router();

// GET request to /api/posts
router.get('/', (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved.' });
    });
});

// GET request to /api/posts/:id
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' });
    });
});

// GET request to /api/posts/:id/comments

router.get('/:id/comments', (req, res) => {
  Post.findPostComments(req.params.id)
    .then((comments) => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' });
    });
});

// POST request to /api/posts/:id/comments
router.post('/:id/comments', (req, res) => {
  Post.findById(req.params.id).then((post) => {
    if (!post) {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
  });
  if (!req.body.text) {
    res.status(400).json({ error: 'Please provide text for the comment.' });
  }
  Post.insertComment(req.body)
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: 'There was an error while saving the comment to the database',
      });
    });
});

// POST request to /api/posts
router.post('/', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }
  Post.insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: 'There was an error while saving the post to the database',
      });
    });
});

// client makes a DELETE request

router.delete('/:id', (req, res) => {
  Post.remove(req.params.id)
    .then((p) => {
      if (p > 0) {
        res.status(200).json({ message: 'the post has been deleted' });
      } else {
        res
          .status(404)
          .json({ message: 'he post with the specified ID does not exist.' });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'The post could not be removed' });
    });
});

// client makes a PUT request

router.put('/:id', (req, res) => {
  const changes = req.body;
  const id = req.params.id;
  Post.findById(id)
    .then((post) => {
      if (!changes.title || !changes.contents) {
        res.status(400).json({
          errorMessage: 'Please provide title and contents for the post.',
        });
      } else {
        Post.update(id, changes)
          .then((post) => {
            res.status(200).json(post);
          })
          .catch((error) => {
            console.log(error);
            res
              .status(500)
              .json({ error: 'The post information could not be modified.' });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    });
});
module.exports = router;
