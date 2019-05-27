var app = require('express')();
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const apiRouter = require('./router/ApiRouter');

app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.use("/api", apiRouter);

mongoose.connect("mongodb://localhost:27017/music-battle", { useNewUrlParser: true }, function (err) {
    if (err) console.log(err);
    else console.log("DB ready");
})

app.listen(1998,(err)=>{
    if(err)console.log(err);
    else console.log("Thanh Cong")
})