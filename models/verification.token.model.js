import { model, Schema } from "mongoose";

const verificationTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        trim: true,
        required: [true, "userId is required!"],
    },
    token: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "verification token is required!"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

verificationTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 }); // 30m

export const VerificationToken = model('verification-token', verificationTokenSchema);

VerificationToken.syncIndexes()
    .then(() => {
        console.log("indexes are synchronized");
    })
    .catch(err => {
        console.error("error synchronizing indexes", err);
    });
