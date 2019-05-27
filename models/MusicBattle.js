const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MusicSchema = new Schema({
    name : { type: String, required: true, unique: true },
    nameSong :{type:String,required:true},
    status:{type:String,default:"Wait"},
    player1:{ type: Schema.Types.ObjectId, ref: 'ProfileUser',required:true},
    player2:{ type: Schema.Types.ObjectId, ref: 'ProfileUser'},
    vote1:{type:Number,default:0},
    vote2:{type:Number,default:0},
},{
    timestamps: true
  });
  
  module.exports = mongoose.model("MusicBattle", MusicSchema);