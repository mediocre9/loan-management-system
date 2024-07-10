import { model, Schema } from "mongoose";

const passwordResetTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        trim: true,
        required: [true, "userId is required!"],
    },
    token: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "password reset token is required!"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

passwordResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 }); // 15m

export const PasswordResetToken = model('password-reset-token', passwordResetTokenSchema);

PasswordResetToken.syncIndexes()
    .then(() => {
        console.log("indexes are synchronized");
    })
    .catch(err => {
        console.error("error synchronizing indexes", err);
    });
