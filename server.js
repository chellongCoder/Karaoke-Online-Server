var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const apiRouter = require('./router/ApiRouter');
const session = require('express-session');
const cors = require('cors');
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     next();
// });
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    // res.header('Access-Control-Allow-Credentials', 'true')
    res.header("Access-Control-Allow-Headers", "origin, x-requested-with, content-type");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");
    next();
});
app.use(cors({ origin: [ 'http://localhost:1998' ], credentials: true }));
app.use(session({
    secret:"nothing in here",
    resave:false,
    saveUninitialized:false,
    // save cookie in 1 week
    cookie:{secure:false, maxAge:1000*60*60*24*7}

}))

app.use(cors({ origin: [ 'https://battlenow.herokuapp.com ' ], credentials: true }));

app.use("/api", apiRouter);
var UserList = [

];
io.on('connection', function (socket) {
    console.log("user connect");
    socket.on("Send-Chat-Content", (data) => {
        Chat = {
            content: data,
            UserName: socket.UserName
        }
        io.sockets.in(socket.phong).emit("Sever-send-chat-data", Chat)
    })
    socket.on("start game ",(data)=>{
        io.sockets.in(socket.phong).emit("Server send Start Game",data);
    })
    socket.on("User-Info", (data) => {
        console.log("data join ", data);
        socket.join(data.Room);
        socket.phong = data.Room;
        socket.UserName = data.UserName;

        var NewUser = {
            UserName: "",
            PeerId: "",
            SocketId: "",
            Room: ""
        }

        NewUser.Room = data.Room;
        NewUser.Role = data.Role;
        NewUser.UserName = data.UserName;
        NewUser.PeerId = data.PeerId;
        NewUser.SocketId = socket.id;

        // console.log("NewUser"+NewUser);
        UserList.push(NewUser);
        // console.log(UserList);
       
        io.sockets.in(data.Room).emit("Sever New Client", data.PeerId);
        if(data.Role == "away"){
            io.sockets.in(data.Room).emit("Player 2 Join", data.UserName);
            var Player2Room=[];
            var j=0;
            for(let i=0;i<UserList.length-1;i++){
               
                if(UserList[i].Room == data.Room){
                    Player2Room[j] = UserList[i].PeerId;
                    j++;
                }
            }
            // console.log(Player2Room);
            socket.emit("Peer list", Player2Room);
        }

    })
});




mongoose.connect("mongodb://127.0.0.1:27017/musicbattleperfect", { useNewUrlParser: true }, function (err) {
    if (err) console.log(err);
    else console.log("DB ready");
})


http.listen(process.env.PORT || 1998, function () {
    console.log('listening on *:1998');
});
