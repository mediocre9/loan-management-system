import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "first name is required!"],
        validate: {
            validator: validator.isAlpha,
            message: props => `${props.value} should not contain any digits or symbols!!`
        },
    },
    lastName: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "last name is required!"],
        validate: {
            validator: validator.isAlpha,
            message: props => `${props.value} should not contain any digits or symbols!!`
        },
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is required!"],
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} is not a valid email format!`
        },
    },
    password: {
        type: String,
        trim: true,
        minLength: 8,
        validate: {
            validator: (_) => {
                return validator.isStrongPassword(_, {
                    minLength: 8,
                    minNumbers: 1,
                    minLowercase: 1,
                    minSymbols: 1,
                    minUppercase: 1
                });
            },
            message: props => `Password '${props.value}' is not strong enough! Make sure your password is at least 8 characters long and includes at least one uppercase letter, one lowercase letter, one symbol, and one numeric value.`
        },
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