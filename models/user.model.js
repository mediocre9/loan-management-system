import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
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

userSchema.pre("save", function (next) {
    if (!this.isModified) {
        return next();
    }

    bcrypt.hash(this.password, 10)
        .then((hashed) => {
            this.password = hashed;
            return next();
        }).catch((error) => {
            return next(error);
        });
})

export const User = model('user', userSchema);