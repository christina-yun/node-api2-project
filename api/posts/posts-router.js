const express = require("express");
const Posts = require("./posts-model");
const router = express.Router();

// [GET] /api/posts
router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({
        message: "The posts information could not be retrieved",
      });
    });
});

// [GET] /api/posts/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "The post information could not be retrieved",
      });
    });
});

// [POST] /api/posts
router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else if (!title.trim() || !contents.trim()) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Posts.insert(req.body)
      .then((newPostId) => {
        res
          .status(201)
          .json({ id: newPostId.id, title: title, contents: contents });
      })
      .catch((err) => {
        res.status(500).json({
          message: "The post information could not be retrieved",
        });
      });
  }
});

// [PUT] /api/posts/:id
router.put("/:id", (req, res) => {
  const changes = req.body;
  const { id } = req.params;

  if (!changes.title || !changes.contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else if (!changes.title.trim() || !changes.contents.trim()) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    });
  } else {
    Posts.update(id, changes)
      .then((postToUpdate) => {
        if (postToUpdate === 0) {
          res.status(404).json({
            message: "The post with the specified ID does not exist",
          });
        } else {
          res.status(200).json({
            id: parseInt(id),
            title: changes.title,
            contents: changes.contents,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "The post information could not be modified",
        });
      });
  }
});

// [DELETE] /api/posts/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const removedPost = await Posts.findById(id);

  await Posts.remove(parseInt(id))
    .then((postToRemove) => {
      if (postToRemove === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      } else {
        res.status(200).json(removedPost);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "The post could not be removed",
      });
    });
});

// [GET] /api/posts/:id/comments
router.get("/:id/comments", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findById(parseInt(postId));
    const comments = await Posts.findPostComments(parseInt(postId));

    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      res.status(200).json(comments);
    }
  } catch (err) {
    res.status(500).json({
      message: "The comments information could not be retrieved",
    });
  }
});
module.exports = router;
