const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const fs = require('fs');
const path = require('path');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const premiumfeatureRoute = require('./routes/premiumFeature');
// const ForgotPasswordRoute = require('./routes/forgotPassword');

// const accessLogStream = fs.createWriteStream(
//    path.join(__dirname,'access.log'),
//    {flags: 'a'}
// );

// const User = require('./models/user');
// const Expense = require('./models/expense');
// const Order = require('./models/orders');
// const ForgotPassword = require('./models/forgotpassword');
// const DownloadedFiles = require('./models/downloadedfile');

const cors = require('cors');
app.use(cors());

// const sequelize = require('./util/database');

// app.use(helmet());
// app.use(compression());
// app.use(morgan('combined', { stream: accessLogStream}));

app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use('/user',userRoute);
app.use('/expense',expenseRoute);
app.use('/purchase',purchaseRoute);
app.use('/premium',premiumfeatureRoute);
// app.use('/password',ForgotPasswordRoute);

app.use((req,res) => {
   console.log('urll',req.url);
   console.log("added extra logs");
   console.log(path.join(__dirname,`public/${req.url}`));
     res.sendFile(path.join(__dirname,`public/${req.url}`));
});

//console.log(process.env.NODE_ENV);

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(ForgotPassword);
// ForgotPassword.belongsTo(User);

// User.hasMany(DownloadedFiles);
// DownloadedFiles.belongsTo(User);

mongoose.connect('mongodb+srv://yatingoyal31:Yatinrock3@cluster0.byipqee.mongodb.net/expense?retryWrites=true&w=majority').then(result =>{
  app.listen(3000);
})
.catch(error => {
  console.log(error);
});
