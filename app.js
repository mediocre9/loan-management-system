/**
 * @todo Implement the password hashng ...
 * 
 * @todo Refactor the code to their separate files
 * such as services, controller, routes etc . . .
 * Probably after all the core functionalities . . . 
 * 
 * @todo Recheck the statusCodes and send the valid ones
 * 
 * @todo Implement refresh token endpoint . . .
 * 
 * @todo Implement Create New and Ticket Features . . .
 */


import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import { ApiError } from "./utils/apiError.js";
import { Token } from "./models/token.model.js";
import rateLimit from "express-rate-limit";
import cors from 'cors';
import { verifyAuth } from "./middlewares/verifyAuth.middleware.js";
import { generateJwt, generateEmailVerificationLink } from "./utils/utils.js";


const PORT = process.env.PORT ?? 8081;
const DB_URL = process.env.LOCAL_DB_URL;


const app = express();


// potential security concern
// always remove these headers . . .
// https://http.dev/x-powered-by
app.disable('x-powered-by');


// enabled rate limiting to avoid Ddos
app.use(rateLimit({ limit: 10, windowMs: 120000 }));


// origin flag is temporarily set to all domains
// will restrict to one because currently we don't
// have a front end . .. 
app.use(cors({ origin: "*", credentials: true }));


app.use(express.json());


app.get("/", (request, response) => {
    response.send("Loan Management System API");
});


app.get("/api/dashboard", verifyAuth(), (request, response) => {
    return response.send("DASHBORD ENDPOINT REACHED");
});


app.post("/api/register-account", async (request, response, next) => {
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            await User.create({ email, password });
        } else if (user.verified) {
            throw new ApiError("User already exists!");
        }

        const verificationLink = await generateEmailVerificationLink(user);
        return response.status(201).json({
            "code": 201,
            "status": "success",
            "message": "A verification link has been sent to your email! It will expire after 2 minutes.",
            "data": {
                "_id": user._id,
                "url": verificationLink
            }
        });
    } catch (error) {
        next(error);
    }
});


app.post("/api/sigin-account", async (request, response, next) => {
    try {
        const { email, password } = request.body;

        const user = await User.findOne({
            email: email,
            password: password,
        });

        if (!user) {
            throw new ApiError("Incorrect email or password!", 400);
        }

        if (!user.verified) {
            throw new ApiError("This account currently is not verified!", 400);
        }

        const accessToken = generateJwt(user, "12h");
        const refreshToken = generateJwt(user, "1d");
        return response.status(200).json({
            "code": 200,
            "status": "success",
            "message": "Signed in to account!",
            "data": {
                "access_token": accessToken,
                "refresh_token": refreshToken,
            }
        });
    } catch (error) {
        next(error);
    }
});

app.get("/api/resend-verification-link/:userId", async (request, response, next) => {
    try {
        const { userId } = request.params;
        const user = await User.findOne({ _id: userId });
        const verificationLink = await generateEmailVerificationLink(user);

        return response.status(201).json({
            "code": 201,
            "status": "success",
            "message": "An verification link has been sent to your email! Email will be expired after 2 minutes!",
            "data": {
                "url": verificationLink
            }
        });
    } catch (error) {
        next(error);
    }
});

app.get("/api/verification/:userId/:token", async (request, response, next) => {
    try {
        const { userId, token } = request.params;

        const exists = await Token.findOneAndDelete({ userId: userId, token: token });

        if (!exists) {
            throw new ApiError("Email verification hsa been expired!");
        }

        const user = await User.findOneAndUpdate({ _id: userId, verified: true });

        const accessToken = generateJwt(user, "12h");
        const refreshToken = generateJwt(user, "1d");
        return response.status(200).json({
            "code": 200,
            "status": "success",
            "message": "Your email has been verified!",
            "data": {
                "access_token": accessToken,
                "refresh_token": refreshToken,
            }
        })
    } catch (error) {
        next(error);
    }
});


app.use("*", (request, response) => {
    return response.status(400).send("404 Not Found!");
});

app.use((error, request, response, next) => {
    return response
        .status(error.statusCode ?? 500)
        .json({
            "code": error.statusCode ?? 500,
            "message": error.message
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