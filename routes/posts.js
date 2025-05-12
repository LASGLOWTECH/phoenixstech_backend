const express = require('express');

const {
    
    getPosts,
    getPost,
    addPost,
    deletePost,
    updatePost
} = require('../controllers/posts');

const router = express.Router();
router.get('/', getPosts)
router.get('/:id', getPost)

router.post("/",  addPost)
router.put("/:id",  updatePost)

router.delete("/:id",  deletePost)

  

module.exports = router

