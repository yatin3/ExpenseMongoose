const Razorpay = require('razorpay');
const Order = require('../models/orders');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function generateAccessToken(id,name,ispremiumuser){
  
    // return jwt.sign({userid:id, name:name, ispremiumuser:ispremiumuser }, '87659937449fgjdh73990303');
    return jwt.sign({userid:id, name:name, ispremiumuser:ispremiumuser }, process.env.Token_Key);
 }
 

exports.purchasepremium = async (req,res) => {
    try{

        var rzp = new Razorpay({
            key_id : process.env.Razorpay_Key,
            key_secret : process.env.Razorpay_Secret
        })
    
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, async(err, order) => {

            if(err){
                throw new Error(JSON.stringify(err));
            }

            const orderData = new Order({
                paymentid: null,
                orderid: null,
                status: 'unsuccessful',
                userid: req.user._id
            })

          await  orderData.save();
          return res.status(201).json({order, key_id : rzp.key_id});

        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({message: 'something went wrong', error: err})
    }
}


exports.updateTransactionStatus = async (req,res) => {

    try{
        const { payment_id, order_id} = req.body;
      const order =   await Order.findById(order_id);

        const promise1 =     order.updateOne({ paymentid: payment_id, status:'SUCCESSFUL'})

         const promise2 =    User.updateOne({isPremiumUser:true});

         Promise.all([promise1,promise2])
         .then(()=>{
            return res.status(202).json({success: true, message:"Transaction Successful",token: generateAccessToken(req.user.id,req.user.name,true)});
         })
                  
    }
    catch(err){
        res.status(404).json(err);
    }
}



exports.updateFailedTransactionStatus = async (req,res) => {

    try{
        const orderId = req.body.order_id;

        const order = await Order.findById( orderId);

            await order.updateOne({status:'FAILED'})

           return res.status(202).json({successful:true, message:"database updated"})
            
    }
    catch(err){
        res.status(404).json(err);
    }
}