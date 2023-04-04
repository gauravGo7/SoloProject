const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { validPhone, validEmail, validName, validPassword} = require("../validator/validation");


exports.createUser = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please give some data" });

    let { fname, lname, email, phone, password,confirmPassword} = data;

    if (!fname) return res.status(400).send({ status: false, message: "FirstName is mandatory" })
    if (!lname) return res.status(400).send({ status: false, message: "lastName is mandatory" })
    if (!email) return res.status(400).send({ status: false, message: "Email is mandatory" })
    if (!phone) return res.status(400).send({ status: false, message: "Phone is mandatory" })

    if (!password) return res.status(400).send({ status: false, message: "Password is mandatory" })
    if (!confirmPassword) return res.status(400).send({ status: false, message: "Password is mandatory" })

    if (!validName(fname.trim())) return res.status(400).send({ status: false, message: "FirstName should be in alphabets only" })
    if (!validName(lname.trim())) return res.status(400).send({ status: false, message: "LastName should be in alphabets only" })

    if (!validEmail(email)) return res.status(400).send({ status: false, message: "Please provide correct email" })
    let findEmail = await userModel.findOne({ email:email })
    if (findEmail) return res.status(400).send({ status: false, message: "User with this email already exists" })

    if (!validPhone(phone)) return res.status(400).send({ status: false, message: "Please provide correct phone number" })
    let findPhone = await userModel.findOne({ phone:phone });
    if (findPhone) return res.status(400).send({ status: false, message: "User with this phone number already exists" })

    if (!validPassword(password)) return res.status(400).send({ status: false, message: "Password Should be (8-15) in length with one upperCase, special character and number" })


    //Hashing
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds)


    const userData = {
      fname: fname, lname: lname, email: email,
      phone: phone, password: hash, 
    }

    const user = await userModel.create(userData);
    return res.status(201).send({ status: true, message: "User created successfully", data: user });

  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}



//------------------------------------------------------------Login Api-------------------------------------------------------------------------------

exports.loginUser = async function (req, res) {
  try {
    let { email, password } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ status: false, message: "please input user Details" });
    }

    if (!email) {
      return res.status(400).send({ status: false, message: "EmailId is mandatory", });
    }
    if (!validEmail(email)) {
      return res.status(400).send({ status: false, message: "EmailId should be Valid", });
    }
    if (!password) {
      return res.status(400).send({ status: false, message: "Password is mandatory" });
    }
    if (password.length < 8 || password.length > 15) {
      return res.status(400).send({ status: false, message: "the length of password must be min: 8 or max: 15", });
    }

    let verifyUser = await userModel.findOne({ email: email });
    if (!verifyUser) return res.status(400).send({ status: false, message: "Invalid Login Credential" });

    
    //-------------------------------------------Decrypt the password and compare the password with user input------------------------------------------//
    
    const isCorrectPassword=bcrypt.compareSync(password, verifyUser.password)
    if(! isCorrectPassword) return res.status(400).send({status:false,message:"Incorrect password"})


    let payload = {
      exp: Math.floor(Date.now() / 1000) + 6000,
      iat: Date.now(), userId: verifyUser["_id"],
    };


    let token = jwt.sign(payload, "soloProject");

    res.setHeader("authorization", token);
    res.status(200).send({ status: true, message: "User login successfull", data: { userId: verifyUser["_id"], token } });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message, });
  }
};