const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
//register functionality
router.post("/register", async (req, res) => {
  try {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and return response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

// login functionality
router.post("/login", async(req,res)=>{
try{
    const user = await User.findOne({email:req.body.email});
    !user && res.status(404).json("user does not exist");
    const validPassword  = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(404).json("Wrong password")

    res.status(200).json(user);
}
catch(err){
    res.status(500).json(err)
}





})

module.exports = router;
