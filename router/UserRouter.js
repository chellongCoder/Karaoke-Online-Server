const express = require('express');
const Router = express.Router();
const UserModel = require('../models/ProfileUser')
const bcrypt = require('bcrypt-nodejs')


// -------------------------------------- API REGISTER ---------------------------------------

// Get info all User
Router.get('/', (req, res) => {
    try {
        UserModel.find({}, (err, UserFound) => {
            if (UserFound) res.json({ success: 1, UserFound })
            else res.json({ success: 0, err })
        })
    } catch (error) {
        console.log(error)
    }
})
//Get  USER by ID
Router.get('/:UserID', (req, res) => {
    try {
        let UserID = req.params.UserID;
        if (UserID) {
            UserModel.findById(UserID, (err, UserFound) => {
                if (UserFound) res.json({ success: 1, user: UserFound })
                else res.json({ success: 0, err })
            })
        } else res.json({ success: 0, err: "Missing parameter ID user!" });
    } catch (error) {
        console.log(error)
    }

})
Router.get('/name/:Username', (req, res) => {

   var username = req.params.Username;
   UserModel.findOne({username},(err,UserFound)=>{
       if(err) res.status(500).send({success:0,err})
       else res.status(201).send({success:1,UserFound});
   })

})

Router.post('/', (req, res) => {
    
    console.log("SIGNUPP",req.body);
    const { username, password, nameDisplay, sex, dateOfBirth, avatarUrl } = req.body;
    const salt = bcrypt.genSaltSync()
    const hashPassword = bcrypt.hashSync(password, salt)
    UserModel.create({ username, hashPassword, nameDisplay, sex, dateOfBirth, avatarUrl }, (err, newuserCreated) => {
        if (err) {
            console.log(err);
            res.status(500).send({ success: 0, err: err });
        }
        else res.status(201).send({ success: 1, newuserCreated })
    }) 
})

Router.put('/:IDuser', async (req, res) => {
    // Only info edited
    console.log("update info")
    const { password, avatarUrl, allPoint } = req.body;
    const updateInfo = { password, avatarUrl, allPoint }
    try {
        let UserFound = await UserModel.findById(req.params.IDuser);
        if (!UserFound) res.status(404).send({ success: 0, message: "user don't exist!" })
        else {
            for (let key in updateInfo) {
                // check new password 
                if (key == 'password' && updateInfo[key]) {
                    let compare = bcrypt.compareSync(updateInfo.password, UserFound.hashPassword)
                    if (!compare) {
                        let salt = bcrypt.genSaltSync()
                        UserFound.hashPassword = bcrypt.hashSync(updateInfo.password, salt)
                    }
                }
                else {
                    if (key == 'allPoint' && updateInfo[key]) {
                        UserFound[key] += parseInt(updateInfo[key]);
                    }
                    else {
                        if (updateInfo[key]) {
                            UserFound[key] = updateInfo[key];
                        }
                    }
                }
            }
            const userUpdated = await UserFound.save();
            res.send({ success: 1, userUpdated })
        }
    } catch (err) {
        res.status(500).send({ succes: 0, mess: err })
    }
})


// Router.put('/:IDuser', async (req, res) => {
//     // Only info edited
//     console.log("update info")
//     const { password, avatarUrl } = req.body;
//     const updateInfo = { password, avatarUrl }

//     try {
//         let UserFound = await UserModel.findById(req.params.IDuser);
//         if (!UserFound) res.status(404).send({ success: 0, message: "user don't exist!" })
//         else {
//             for (let key in updateInfo) {
//                 // check new password 
//                 if (key == 'password' && updateInfo[key]) {
//                     let compare = bcrypt.compareSync(updateInfo.password, UserFound.hashPassword)
//                     if (!compare) {
//                         let salt = bcrypt.genSaltSync()
//                         UserFound.hashPassword = bcrypt.hashSync(updateInfo.password, salt)
//                     }
//                 }
//                 if (updateInfo[key]) {
//                     UserFound[key] = updateInfo[key];
//                 }
//             }
//             const userUpdated = await UserFound.save();
//             res.send({ success: 1, userUpdated })
//         }
//     } catch (err) {
//         res.status(500).send({ succes: 0, mess: err })
//     }
// })

// Delete User 

Router.delete('/:IDuser', (req, res) => {
    let idUser = req.params.IDuser;
    UserModel.findOneAndRemove(idUser, (err) => {
        if (err) res.json({ success: 0, message: "Can't delete user" });
        else res.json({ success: 1, message: "Deleted user" })
        if (!idUser) res.status(404).send({ succes: 0, mess: "user deleted" })
    })
})

// // --------------------------------------API LOG IN ---------------------------------------





module.exports = Router;
