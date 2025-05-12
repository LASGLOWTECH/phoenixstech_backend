const express = require('express')
const db = require('../db.js')

// get all posts
const getPosts = (req, res) => {

        const q = " SELECT * FROM posts"

        db.query(q, (err, data) => {

                if (err) return res.status(500).send(err)
                return res.status(200).json(data)
        })
}


  
// Get single post
const getPost = (req, res) => {
        const q = "SELECT `title`, `content`, `cover`,   `timestamp` FROM posts WHERE id = ?"; 
    
        db.query(q, [req.params.id], (err, data) => {
            if (err) {
                console.error(err); // Log the error for debugging
                return res.status(500).json(err);
            }
    
            if (data.length === 0) {
                return res.status(404).json({ message: "Post not found" });
            }
    
            console.log(data[0]); // Log the returned data
            return res.status(200).json(data[0]);
        });
    }
    
    

    
    const addPost = (req, res) => {
        if (!req.body.cover  || !req.body.title || !req.body.content.trim() === "") {
            return res.status(400).json({ error: "unable to Submit" });}
            
        const q = "INSERT INTO posts (`cover`, `title`, `content`, `shares`) VALUES (?)";
        const values = [
            req.body.cover,
            req.body.title,
            req.body.content,
            0 // default share count
        ];
    
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json({ error: err.message });
    
            return res.status(200).json({ message: "Post created successfully", postId: data.insertId });
        });
    };


const deletePost = (req, res) => {
      

     
          
                const postId = req.params.id

                const q = " DELETE FROM posts WHERE `id`=? "
                db.query(q, [postId], (err, data) => {
                        if (err) return res.status(403).json("you have access to your post only!")

                        return res.status(200).json("post deleted")

                })


        



        

}

const updatePost = (req, res) => {

       

                const postId = req.params.id

                const q = "UPDATE posts SET title = ?, content = ?, cover = ?,  WHERE id = ?";
                const values = [
                        req.body.title,
                        req.body.descr,
                        req.body.image,
                        req.body.cat,
                        postId, ]


                        db.query(q, values, (err, data) => {
                                if (err) return res.status(500).json(err);
                        
                                return res.status(200).json("Post updated successfully");
                            });



        
}
module.exports = { getPosts, addPost, deletePost, updatePost, getPost }