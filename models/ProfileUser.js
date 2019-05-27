const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProfileUserModel = new Schema({
        // _id: {type:Schema.Types.ObjectId, ref:"RoomBattle"} ,
        
        username:{type:String, required:true,unique:true},
        hashPassword:{type:String, required:true},
        nameDisplay:{type:String ,required:true, unique:true},
        allPoint:{type:Number, default:0},
        avatarUrl: {type:String,default:"https://www.mvhsoracle.com/wp-content/uploads/2018/08/default-avatar.jpg"},
        sex:{type:String, required:true},
        dateOfBirth:{type:Number , required:true}
    
},{
    timestamps:true
})

module.exports= mongoose.model("ProfileUser" , ProfileUserModel);