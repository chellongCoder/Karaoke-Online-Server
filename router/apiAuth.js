const express = require('express');
const bcrypt = require('bcrypt-nodejs');

const apiAuth = express.Router();

const UserModel = require('../models/ProfileUser');

apiAuth.post('/login', (req, res) => {
  console.log("da log in")
  const user= {
    username,
    password
  } = req.body;
  console.log(user)
  if (!username || !password) {res.status(400).send({success: 0,message: 'Missing username or password!'});} 
  else {
    UserModel.findOne({ username }, (err, userFound) => {
      if (err) {
          res.status(500).send({ success: 0, message: "sai o day" });
      }
      else {
          if (!userFound) {
            console.log("ko tim thay?????");
              res.status(404).send({ success: 0, message: "ten dang nhap ko ton tai" });
              // alert("Không tồn tại username "+this.state.username)
          }
          else {
              console.log("so sanh")
              let cmp = bcrypt.compareSync(password, userFound.hashPassword);
              // let cmp = 1;
              if (cmp) {
                req.session.user = userFound
                console.log("Thành Công");
                // alert("Đăng Nhập Thành Công")
                  res.status(201).send({ success: 1, userFound });
              }
              else {
                console.log("deo dc");
                // alert("Sai Mật Khẩu")
                res.status(401).send({ success: 0, message: "Sai Mat Khau" });
            }
        }
      }
  })
  
  }
});
apiAuth.get('/CheckIII',(req,res)=>{
    res.status(201).send({success:1,message:"ThanhCong"});
})

// logout -------------- 
apiAuth.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(500).send({
      success: 0,
      err
    })
    else res.send({
      success: 1,
      message: "Success!"
    });
  });
});

apiAuth.get('/login/check', (req, res) => {
  if(req.session.user) res.send({success: 1, user: req.session.user});
  else res.status(401).send({success: 0, message: "failed"})
})
module.exports = apiAuth;
