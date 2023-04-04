const mongoose=require('mongoose')


const userSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: true,
            lowercase:true,
            trim:true
        },
        lname: {
            type: String,
            required: true,
            lowercase:true,
            trim:true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase:true,
            trim:true
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim:true
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            maxLength: 15,
            trim:true
        },
        confirmPassword: {
            type: String,
            required: true,
            minLength: 8,
            maxLength: 15,
            trim:true
        }
        }
    , { timestamps: true });

module.exports=mongoose.model("User",userSchema)