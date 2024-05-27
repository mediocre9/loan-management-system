import { model, Schema } from "mongoose";

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        trim: true,
        required: [true, "userId is required!"],
    },
    otp: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "otp is required!"],
    },
    createdAt: { type: Date, default: Date.now }
});

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // 1h expiration

export const OTP = model('otp', otpSchema);