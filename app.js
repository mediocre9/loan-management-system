/**
 * @todo Refactor the code to their separate files
 * such as services, controller, routes etc . . .
 * Probably after all the core functionalities . . . 
 * 
 * @todo Recheck the response statusCodes and send the valid ones
 * 
 * @todo Implement Create New and Ticket Features . . .
 * 
 * @todo Consider dynamically implementing 
 * rate limiting for various routes based on their importance
 * 
 * @todo Use the helmet package for security . . .
 * 
 * @todo update the TTL index of OTP to 5 minutes
 */


import express from "express";
import rateLimit from "express-rate-limit";
import cors from 'cors';
import morgan from "morgan";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import "dotenv/config";

import { ApiError } from "./utils/apiError.js";
import { OTP, User } from "./models/index.js";
import { verifyAuth, validateFields } from "./middlewares/index.js";
import { decodeToken, getAuthTokens, sendEmailToClient } from "./utils/index.js";


const PORT = process.env.PORT ?? 8081;
const DB_URL = process.env.LOCAL_DB_URL;

const app = express();

app.disable('x-powered-by');

app.use(morgan("dev"))

app.use(rateLimit());

app.use(cors({ origin: "*", credentials: true }));

app.use(express.json());


app.get("/", (request, response) => {
    response.send("Loan Management System API");
});


app.get("/dashboard", verifyAuth(), (request, response) => {
    return response.send("DASHBORD ENDPOINT REACHED");
});


app.post("/register-account", validateFields(["email", "password"]), async (request, response, next) => {
    try {
        const { email, password } = request.body;
        let user = await User.findOne({ email: email });

        if (!user) {
            user = await User.create({ email, password });
        } else if (user.verified) {
            throw new ApiError("email is already in use!", 409);
        }
        await sendEmailToClient(user);
        return response.status(201).json({
            "code": 201,
            "status": "success",
            "message": "A verification code has been sent to your email! It will expire after 2 minutes.",
            "data": {
                "_id": user._id,
            }
        });
    } catch (error) {
        next(error);
    }
});


app.post("/login-account", validateFields(["email", "password"]), async (request, response, next) => {
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new ApiError("Incorrect email or password!", 400);
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) {
            throw new ApiError("Incorrect email or passsword!", 400);
        }

        if (!user.verified) {
            await sendEmailToClient(user);
            return response.status(200).json({
                "code": 200,
                "status": "success",
                "message": `If ${email} matches the email address on your account, we'll send you a verification code.`,
                "data": {
                    "_id": user._id,
                }
            });
        }

        const { accessToken, refreshToken } = getAuthTokens(user);
        return response.status(200).json({
            "code": 200,
            "status": "success",
            "message": "Signed in to account!",
            "data": {
                "_id": user._id,
                "tokens": {
                    "access_token": accessToken,
                    "refresh_token": refreshToken,
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

app.get("/resend-verification-code", rateLimit({
    limit: 3,
    windowMs: 3600000,
    message: "You have exceeded the maximum number of OTP requests. Please try again tomorrow.",
}), async (request, response, next) => {
    try {
        const { email } = request.query;

        if (!email) {
            throw new ApiError("email query param is required!");
        }

        const user = await User.exists({ email: email });

        if (user) {
            await sendEmailToClient(user);
        }

        return response.status(200).json({
            "code": 200,
            "status": "success",
            "message": `If ${email} matches the email address on your account, we'll send you a verification code.`,
        });
    } catch (error) {
        next(error);
    }
});

app.post("/account-verification", validateFields(["userId", "otp"]), async (request, response, next) => {
    try {
        const { userId, otp } = request.body;

        const exists = await OTP.findOne({ userId: userId, otp: otp });

        if (!exists) {
            throw new ApiError("Your otp has been expired!");
        }

        await OTP.findByIdAndDelete(exists._id);
        const user = await User.findByIdAndUpdate(userId, { verified: true });

        const { accessToken, refreshToken } = getAuthTokens(user);

        return response.status(200).json({
            "code": 200,
            "status": "success",
            "message": "Your email has been verified!",
            "data": {
                "_id": user?._id,
                "tokens": {
                    "access_token": accessToken,
                    "refresh_token": refreshToken,
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * if user clicks on reset password button
 * we send user email as query params at endpoint
 */
app.get("/reset-password", async (request, response, next) => {
    try {
        const { email } = request.query;
        const user = await User.exists({ email: email });

        if (user) {
            await sendEmailToClient(user);
        }

        return response.status(200).json({
            "code": 200,
            "status": "success",
            "message": `If ${email} matches the email address on your account, we'll send you a code.`,
            "data": {
                "_id": user?._id,
            }
        });
    } catch (error) {
        next(error);
    }
});


/**
 * a code verification page to verify the user
 * if user has received the code he enters it 
 * to verify the indentity.
 * And then we will send a new page to enter
 * the new password to update
 */
app.post("/reset-password", validateFields(["userId", "otp"]), async (request, response, next) => {
    try {
        const { userId, otp } = request.body;

        const otpCode = await OTP.findOne({ userId: userId, otp: otp });

        if (!otpCode) {
            throw new ApiError("Your otp has been expired!", 401);
        }

        return response.status(201).json({
            "code": 200,
            "status": "success",
            "message": "otp verified successfully",
            "data": {
                "_id": userId,
            }
        });
    } catch (error) {
        next(error);
    }
});


/**
 * here we will obtain the user's new password
 * to update it
 */
app.patch("/reset-password", validateFields(["userId", "password"]), async (request, response, next) => {
    try {
        const { userId, password } = request.body;

        const user = User.findById(userId);

        if (!user) {
            throw new ApiError("User not found!", 404);
        }

        const isSamePassword = bcrypt.compareSync(password, user.password);

        if (isSamePassword) {
            return response.status(400).json({
                "code": 400,
                "status": "failure",
                "message": "New password should be different from the current password!",
                "data": {
                    "_id": userId,
                }
            });
        }

        await User.findByIdAndUpdate(userId, { password: password });

        return response.status(200).json({
            "code": 200,
            "status": "success",
            "message": "Password changed successfully",
            "data": {
                "_id": userId,
            }
        });

    } catch (error) {
        next(error);
    }
});

app.get("/refresh-token", verifyAuth({ tokenType: 'refresh' }), async (request, response, next) => {
    try {
        const { _id, email } = decodeToken(request.token);
        const user = { _id, email };

        const { accessToken, refreshToken } = getAuthTokens(user);

        return response.status(200).json({
            "code": 200,
            "status": "success",
            "message": "Tokens refreshed successfully.",
            "data": {
                "_id": _id,
                "tokens": {
                    "access_token": accessToken,
                    "refresh_token": refreshToken,
                }
            }
        });
    } catch (error) {
        next(error);
    }
});


app.use("*", (request, response) => {
    return response.status(400).send("404 Not Found!");
});

app.use((error, request, response, next) => {
    if (error instanceof ApiError) {
        return response
            .status(error.statusCode)
            .json({
                "code": error.statusCode,
                "message": error.message
            });
    }

    return response
        .status(500)
        .json({
            "code": 500,
            "message": "Internal Server Error!"
        });
});


mongoose.connect(DB_URL).then(() => {
    console.log("Database connection established!");
}).catch((error) => {
    console.log(error);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
