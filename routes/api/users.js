const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @route               POST api/users
// @description         Register user
// @access              Public 
router.post('/',[
        check('name','Name is required')
        .not()
        .isEmpty(),
        check('email','Please include a valid email').isEmail(),
        check('password','Please ente a valid password of 6 or more characters').isLength({min:6})
    ],
    async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const { name, email, password }=req.body;

    try{
        let user = await User.findOne({email});
        if(user){
            res.status(400).json({
                errors:[{msg:'User already exsists'}]
            });
        }
        
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password  = await bcrypt.hash(password,salt);
        await  user.save();
        const payload = {
            user:{
                    id:user.id,
            }
        }
        jwt.sign(payload, config.get('jwtSecret'),{expiresIn:360000},
        (err,token)=>{
            if(err) throw err;
            res.json({token});

        });

    } catch(err){
        res.status(500).send('Server Error');
    }



});




// @route               GET api/users
// @description         User Route
// @access              Private
router.get('/', auth, async (req, res)=>{
    try{
        const users = await User.find().select('-password');
        res.json(users);
    } catch(err){
        res.status(500).send('Server Error'+err);

    }
});



module.exports = router