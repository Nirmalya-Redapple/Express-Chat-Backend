const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check,validationResult} =require('express-validator/check');
const Post = require('../../models/Post');

const User = require('../../models/User');

// @route               POST api/posts
// @description         Create a post
// @access              Private 
router.post('/',[auth, [
    check('text','Text is required').not().isEmpty()
]],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        return res.json(post);

    } catch (err) {
        return res.status(500).send("Server Error");   
    }
});



// @route               Delete api/posts/:id
// @description         Delete a post
// @access              Private 
router.delete('/:id', auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({msg:'Post not found'});
        }
        
        //Check user
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized'});
        }
        await post.remove();
        return res.json({msg:'Post removed'});
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error');
    }
});



// @route               GET api/posts
// @description         Test route
// @access              Public 
router.get('/',auth,async (req,res)=>{
    try{

        const posts = await Post.find().sort({date: -1});
        return res.json(posts);
    }
    catch (error) {

    }
});



// @route               PUT api/posts/like/:id
// @description         Test route
// @access              Public 
router.put('/like/:id',auth,async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        //check if the post is already been liked
        if(post.likes.filter(like => like.user.toString()=== req.user.id).length > 0){
            const removeIndex = post.likes.map(like =>like.user.toString().indexOf(req.user.id));
            post.likes.splice(removeIndex,1);
            await post.save();

        
            return res.json(post.likes);

        }
        post.likes.unshift({user: req.user.id});
        await post.save();
        
        return res.json(post.likes);


    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error');

    }
});



module.exports = router