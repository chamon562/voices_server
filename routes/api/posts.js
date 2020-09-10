require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;
console.log(process.env);
// Load User model
// const User = require('../../models/User');
const Post = require('../../models/Post');

router.get('/post', (req, res)=>{
    Post.find()
    .populate("postedBy", "_id")
    .sort('-createAt')
    .then(foundPost=>{
        res.json({post:foundPost})
    })
    .catch(err=> {
        console.log('Error while posting post', err)
        
    })
})

// create a new post
router.post('/newpost', (req, res)=>{
    const {title, content, category} = req.body
    const post = new Post ({
        
        title,
        content,
        category,
        postedBy: req.user
    })
    post.save()
    .then(createdPost=>{
        res.json({post:createdPost})
    })
    .catch(err=> {
        console.log('Error while creating new post', err)
        
    })
})

//upload image
router.put('/picture', (req, res)=>{
    Post.findByIdAndUpdate(
      req.user._id,
      {$set:{image:req.body.image}},
      {new: true},
      (err, result)=>{
        if(err){
          return res.status(422).json({error:'pic cannot post'})
        }
        res.json(result)
      })
  })

//click 'like' button
// router.put('/reaction', (req, res)=>{
//     db.Post.findByIdAndUpdate(
//         req.body.id,
//         {$push:{reaction:req.user.id}},
//         {new: true}) 
// })
// .exec((err, result)=>{
//     if(err){
//         return res.status(422).json({error: err})
//     } else {
//         res.json(result)
//     }
// })

// unclick 'like' button
// router.put('/reaction', (req, res)=>{
//     db.Post.findByIdAndUpdate(
//         req.body.id,
//         {$pull:{reaction:req.user.id}},
//         {new: true}) 
// })
// .exec((err, result)=>{
//     if(err){
//         return res.status(422).json({error: err})
//     } else {
//         res.json(result)
//     }
// })

// edit post
router.put('/:id', (req,res)=>{
   Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    )
    .populate("postedBy", "_id")
    .exec((err, result)=>{
        if (err){
            return res.status(422).json({error:err})
        } else {
            res.json(result)
        }
    })
})

// delete post
router.delete('/:id', (req,res)=>{
    Post.findByIdAndDelete(
        req.params.id
        )
    .populate("postedBy", "_id")    
    .then(()=>{
        res.json('post deleted')
    })
    .catch(err=>{
        res.status(400).json('error', err)
    })   
    
})


module.exports = router