import { model, Schema } from "mongoose";
import isEmail from "validator/lib/isEmail.js";

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is required!"],
        validate: {
            validator: isEmail,
            message: props => `${props.value} is not a valid email format!`
        },
    },
    password: {
        type: String,
        trim: true,
        minLength: 8,
        required: [true, "Password is required!"],
    },
    verified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });



export const User = model('user', userSchema);