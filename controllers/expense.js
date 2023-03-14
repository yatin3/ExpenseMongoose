
const Expense = require('../models/expense');
const mongoDb = require('mongodb');
const User = require('../models/user');

const ObjectId = mongoDb.ObjectId;

exports.postExpense = async (req,res,next) =>{

    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    try{
    const expense = new Expense({
          amount:amount,
          description:description,
          category:category,
          userId:req.user._id
    });
 
       const answer =   await expense.save();

      const usedData =  await User.findById(req.user._id);

      const userAmount = usedData.amount+Number(amount);
   
       await usedData.updateOne({amount: userAmount});

       res.status(201).json(answer);
  }
  catch(err){
    console.log(err);
     res.status(500).json(err);
  }
 
 };
 
 exports.getExpense = async (req,res,next) => {
   
  //   try{
      
  //    const Expenses = await Expense.find();

  //      res.status(201).json(Expenses); 
  //   }
  //  catch(err){
  //      res.status(404).json(err);
  //  }

  try{
     
    const page = req.query.page || 1;

    const rows = 3;

    const Items_Per_Page = rows;

    const count = await Expense.count();

  const Expenses = await Expense.find({}).skip((page-1) * Items_Per_Page).limit(Number(Items_Per_Page)).exec();

    console.log(Expenses);
    res.status(201).json({
       expenses:Expenses,
       currentPage: Number(page),
       hasNextPage:  Items_Per_Page*page < count,
       nextPage:Number(page)+1,
       hasPreviousPage:Number(page)>1,
       previousPage:Number(page)-1,
       lastPage:Math.ceil(count/Items_Per_Page)
    }); 
 }
catch(err){
    res.status(404).json(err);
}
 
 };


 
 exports.deleteExpense = async(req,res,next) => {
 
     const id = req.params.ExpenseId; 
    try{
     const result =  await Expense.findOneAndDelete({_id:id, userId: req.user._id});

     const usedData =  await User.findById(req.user._id);

     const userAmount = usedData.amount-Number(result.amount);

     await usedData.updateOne({amount: userAmount});
        
           res.status(201).json({success:true,message:"successfully deleted"});
    }
    catch(err){
        console.log(err);
      res.status(404).json(`${err}`);
    }
 };

