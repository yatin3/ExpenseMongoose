const User = require('../models/user');
const Expense = require('../models/expense');

exports. getUserLeaderBoard = async (req,res) =>{
  
  try{
     
    const leaderBoardOfUser = await User.find().select('name amount -_id');



    console.log(leaderBoardOfUser);
     res.status(200).json(leaderBoardOfUser);
    }

  catch(err){
    console.log(err);
    res.status(500).json(err);
  
}

}

