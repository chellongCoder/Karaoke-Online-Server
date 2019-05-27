const express = require('express');
const musicRouter = express.Router();
const musicModel = require('../models/MusicBattle');

musicRouter.get("/", (req, res) => {
    console.log("getttttttt");
    musicModel.find({}, (err, battles) => {
        if (err) res.status(500).send({ success: 0, err })
        else res.send({ success: 1, battles });
    });
})

musicRouter.post("/", (req, res) => {
    const { name, nameSong,player1 } = req.body;
    musicModel.create({ name, nameSong,player1 }, (err, battleCreated) => {
        if (err) res.status(500).send({ success: 0, err });
        else res.status(201).send({ success: 1, battleCreated });
    })
})

musicRouter.put("/:musicGameId", (req, res) => {
    const { status, vote1, vote2, player2} = req.body;
    var updateInfo = { status, vote1, vote2, player2 };
    musicModel.findById(req.params.musicGameId, (err, battleFound) => {
        if (err) res.status(500).send({ success: 0, err });
        else {
            if (!battleFound) res.status(404).send({ success: 0, message: "Not found battle" })
            else {
                for (let key in updateInfo) {
                    
                    if (updateInfo[key]) {
                        
                        if (key == "vote1") {
                            battleFound[key] += 1;
                        }
                        else {
                            if (key == "vote2") {
                                battleFound[key] += 1;
                            }
                            else {
                                battleFound[key] = updateInfo[key];
                            }
                        }
                    }
                }
                battleFound.save((err, battleUpdate) => {
                    if (err) res.status(500).send({ success: 0, err })
                    else res.status(201).send({ success: 1, battleUpdate });
                })
            }
        }
    })

})



musicRouter.put("/name/:musicGameName", (req, res) => {
    console.log("Update By Name");
    const { status, vote1, vote2, player2} = req.body;
    var updateInfo = { status, vote1, vote2, player2 };
    var name =  req.params.musicGameName;
    musicModel.findOne({name}, (err, battleFound) => {
        if (err) res.status(500).send({ success: 0, err });
        else {
            if (!battleFound) res.status(404).send({ success: 0, message: "Not found battle" })
            else {
                for (let key in updateInfo) {
                    
                    if (updateInfo[key]) {
                        
                        if (key == "vote1") {
                            battleFound[key] += 1;
                        }
                        else {
                            if (key == "vote2") {
                                battleFound[key] += 1;
                            }
                            else {
                                battleFound[key] = updateInfo[key];
                            }
                        }
                    }
                }
                battleFound.save((err, battleUpdate) => {
                    if (err) res.status(500).send({ success: 0, err })
                    else res.status(201).send({ success: 1, battleUpdate });
                })
            }
        }
    })

})

musicRouter.get('/:battleId',(req,res)=>{
   
    musicModel.findById(req.params.battleId,(err,battleFound)=>{
        if(err) res.status(500).send({success:0,err});
        else res.status(201).send({success:1,battleFound});
    })
})
musicRouter.get('/name/:battleName',(req,res)=>{
    var name=req.params.battleName;
    
    musicModel.findOne({name})
    .populate('player1')
    .populate('player2')
    .exec((err,battleFound)=>{
        if(err) res.status(500).send({success:0,err});
        else res.status(201).send({success:1,battleFound});
    })
})

musicRouter.delete('/:IDroom', (req, res) => {
    let idRoom = req.params.IDroom;
    musicModel.findOneAndRemove(idRoom, (err) => {
        if (err) res.json({ success: 0, message: "Can't delete room" });
        else res.json({ success: 1, message: "Deleted room" })
        if (!idRoom) res.status(404).send({ succes: 0, mess: "room not exist" })
    })
})


module.exports = musicRouter;