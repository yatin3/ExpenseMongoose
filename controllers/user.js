const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringInvalid(s){

   if(s.length === 0 ||s == null ){
     return true;
   }
   return false;
}

exports.postUser = (req,res,next)=>{
    
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;

   try{
      if(isStringInvalid(user) || isStringInvalid(email) || isStringInvalid(password)){
         return res.json(400).json({error: "Bad Parameters . Something is Missing"});
       }
   
       bcrypt.hash(password,10, async (err,hash) => {
      
         const userdata = new User({
            name:user,
            email:email,
            password: hash,
            isPremiumUser: false,
            amount: 0
         });

         await userdata.save();

         res.status(201).json({message: "Successfully created new user"})
   })
   }
     catch(err){
      res.status(500).json({message: "user already exist"});
      };

};

function generateAccessToken(id,name,ispremiumuser){
  
 //  return jwt.sign({userid:id, name:name, ispremiumuser:ispremiumuser }, '87659937449fgjdh73990303');
   return jwt.sign({userid:id, name:name,ispremiumuser:ispremiumuser }, process.env.Token_Key);
}

exports.checkUser = async (req,res,next) => {
     
    const email = req.body.email;
    const password = req.body.password;

    try{
      if(isStringInvalid(email) || isStringInvalid(password)){
         return res.json(400).json({message: "Bad Parameters . Something is Missing",success: false});
       }
   
       const user = await User.findOne({ email:email }).exec();

       console.log(user);
         
         if(user !== null ){

            bcrypt.compare(password ,user.password,(err,result)=>{

               if(err){
                  // return res.status(500).json({success:true, message:"something went wrong"});
                  throw new Error("Something Went Wrong");
               }
               if(result === true){
                  return res.status(201).json({message:"user logged in successfully", token: generateAccessToken(user._id,user.name,user.isPremiumUser)});
               }
               else{
                  return res.status(401).json({message:"user not authorized" , success: false});
               }
            })
        }
         else {
            return res.status(404).json({message:"user not found" , success: false});
         }
   
    }
    catch(err){
      console.log(err);
       return res.status(500).json(err);
    }

};

