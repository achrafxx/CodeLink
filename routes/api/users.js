var express = require('express');
const router = express.Router();
const {check,validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const gravatar = require("gravatar");
const auth = require("../../middleware/auth");


// @route   POST api/users
// @desc    Register user route
// @access  Public

router.post("/",[
        check("name","name is required").not().isEmpty(),
        check("email","please include a valid email").isEmail(),
        check("password","please enter a passwrod with 6 or more chars").isLength({
            min:6})
    ],
    async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const {name,email,password} = req.body;
        try{
            //test if the user exists 
            let user = await User.findOne({email})
            if(user){
               return res.status(400).json({errors:[{msg:"User Already Exists"}]})
            }
            let avatar = gravatar.url(email,{
                s: '200',
                r: 'mm',
                d: 'mm'
            })
            avatar = "http:"+avatar;
            console.log(avatar);
            user = new User({
                name,
                email,
                avatar,
                password
            })
            
            //Encrypt the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);
            await user.save();

            //Return JWT
            const payload = {
                user:{
                    id : user.id
                }
            }
            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: 360000},
                (err,token)=>{ 
                    if(err) throw err;
                    res.send({token});
                }
            )
        }
        catch(err){
            console.log(err.message);
            res.status(500).send("server error");
        }
            
});

// @route   POST api/users
// @desc    Register user route
// @access  Public

router.get("/",auth,async (req,res)=>{
    try {
        let users = await User.find();
        res.send(users);
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;
