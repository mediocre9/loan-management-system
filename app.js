/**
 * @todo Refactor the code to their separate files
 * such as services, controller, routes etc . . .
 * Probably after all the core functionalities . . . 
 * 
 * @todo Refactor HTML templates with partials - (optional)
 * 
 * @todo Recheck the response statusCodes and send the valid ones
 * 
 * @todo Remove CORS
 * 
 * @todo Implement Create New and Ticket Features . . .
 * 
 * @todo rate limiting for various routes based on their importance
 * 
 * @todo Use the helmet package for security . . .
 * 
 * @todo Implement resend-password and resend-verification routes
 * 
 * @todo update/recheck the TTL index of [VerificationToken] to 30 minutes
 * 
 * @todo update/recheck the TTL index of [PasswordResetToken] to 15 minutes
 * 
 * @todo Retest the flow of application
 * 
 * @todo Consider the use of flash messages - (optional)
 */


import express from "express";
import rateLimit from "express-rate-limit";
import cors from 'cors';
import morgan from "morgan";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import validator from "validator";
import MaskData from "maskdata";
import { log } from "console";
import "dotenv/config";

import { ApiError } from "./utils/apiError.js";
import { AuthError } from "./utils/authError.js";
import { VerificationToken, User } from "./models/index.js";
import { verifyAuth, validateFields } from "./middlewares/index.js";
import { getAuthToken, sendEmailToClient } from "./utils/index.js";
import { generateVerficationLink } from "./utils/utils.js";
import { PasswordResetToken } from "./models/passwordReset.token.model.js";


const PORT = process.env.PORT ?? 8081;
const DB_URL = process.env.LOCAL_DB_URL;

const app = express();

app.disable('x-powered-by');

app.use(morgan("dev"))

// app.use(rateLimit());

// app.use(cors({ origin: "*", credentials: true }));

app.use(express.json());

app.set("view engine", "ejs");

app.set("views", "./views");

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve("./public")));

app.get("/", verifyAuth(), (request, response) => {
    const authorized = request.token;
    const { email, firstName, lastName } = request.decoded;
    if (!authorized) {
        return response.render("login");
    }
    return response.render("dashboard", { "email": email, "fullName": firstName.concat(" ", lastName) });
});

app.get("/login", (request, response) => {
    return response.render("login");
});

app.get("/register", (request, response) => {
    return response.render("register");
});


app.get("/dashboard", verifyAuth(), (request, response) => {
    const authorized = request.token;
    const { email, firstName, lastName } = request.decoded;
    if (!authorized) {
        return response.render("login");
    }
    return response.render("dashboard", { "email": email, "fullName": firstName.concat(" ", lastName) });
});


app.get("/create", verifyAuth(), (request, response) => {
    const authorized = request.token;
    const { email, firstName, lastName } = request.decoded;
    if (!authorized) {
        return response.render("login");
    }
    return response.render("create", { "email": email, "fullName": firstName.concat(" ", lastName) });
});

app.post("/register", validateFields(["firstName", "lastName", "email", "password"]), async (request, response, next) => {
    try {
        const { firstName, lastName, email, password } = request.body;

        if (!validator.isAlpha(firstName)) {
            throw new ApiError(`${firstName} should not contain any digits or symbols!`);
        }

        if (!validator.isAlpha(lastName)) {
            throw new ApiError(`${lastName} should not contain any digits or symbols!`);
        }

        if (!validator.isEmail(email)) {
            throw new ApiError(`${email} is not a valid email address!`);
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minSymbols: 1,
            minUppercase: 1
        })) {
            throw new ApiError(`Password ${password} is not strong enough! Make sure your password is at least 8 characters long and includes at least one uppercase letter, one lowercase letter, one symbol, and one numeric value.`);
        }

        let user = await User.findOne({ email: email });

        if (!user) {
            user = await User.create({ firstName, lastName, email, password });
        } else if (user.verified) {
            throw new ApiError("email is already in use!", 409);
        }

        const { link, token } = await generateVerficationLink({
            endpoint: "verification",
            userId: user._id
        });

        const exists = await VerificationToken.findOne({ userId: user._id, token: token });

        if (!exists) {
            await VerificationToken.create({ userId: user._id, token: token });
        }

        await sendEmailToClient({ email: email, link: link });

        const maskedEmail = MaskData.maskEmail2(email, {
            maskWith: "*",
            unmaskedStartCharactersBeforeAt: 2
        });

        return response
            .status(201)
            .render("verification", {
                "email": maskedEmail
            });
    } catch (error) {
        next(error);
    }
});


app.get("/verification", async (request, response, next) => {
    try {
        const { userId, token } = request.query;

        const exists = await VerificationToken.findOne({ userId: userId, token: token });

        if (!exists) {
            throw new ApiError("A verification link has been expired!");
        }

        await VerificationToken.findByIdAndDelete(exists._id);
        const user = await User.findByIdAndUpdate(userId, { verified: true });
        const authToken = getAuthToken(user);
        return response
            .status(200)
            .cookie("_aid", authToken)
            .redirect("/dashboard");
    } catch (error) {
        next(error);
    }
});


app.post("/login", validateFields(["email", "password"]), async (request, response, next) => {
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
            const { link, token } = await generateVerficationLink({
                endpoint: "verification",
                userId: user._id
            });

            await VerificationToken.create({ userId: user._id, token: token });

            log(link);
            await sendEmailToClient({ email: email, link: link });

            const maskedEmail = MaskData.maskEmail2(email, {
                maskWith: "*",
                unmaskedStartCharactersBeforeAt: 2
            });

            return response.status(201).render("verification", {
                "email": maskedEmail
            });
        }

        const authToken = getAuthToken(user);
        return response.status(200)
            .cookie("_aid", authToken)
            .redirect("/dashboard");
    } catch (error) {
        next(error);
    }
});



app.get("/reset-password", async (request, response) => {
    return response.status(200).render("reset-password");
});


app.post("/reset-password", validateFields(["email"]), async (request, response, next) => {
    try {
        const { email } = request.body;

        if (!validator.isEmail(email)) {
            throw new ApiError(`${email} is not a valid email address!`);
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return response.status(200).render("reset-password", {
                message: "A password reset link has been sent to your email!"
            });
        }

        const { link, token } = await generateVerficationLink({
            endpoint: "change-password",
            userId: user._id
        });
        console.log(link);
        const exists = await PasswordResetToken.findOne({ userId: user._id, token: token });
        if (!exists) {
            await PasswordResetToken.create({ userId: user._id, token: token });
        }

        await sendEmailToClient({ email: email, link: link });

        return response.status(200).render("reset-password", {
            message: "A password reset link has been sent to your email!"
        });

    } catch (error) {
        next(error);
    }
});

app.get("/change-password", async (request, response, next) => {
    try {
        const { userId, token } = request.query;

        const exists = await PasswordResetToken.findOne({ userId: userId, token: token, });

        if (!exists) {
            throw new ApiError("Password reset link has been expired!");
        }

        return response
            .status(200)
            .cookie("_rpid", token) // RPID - Reset Pwd Id (token)
            .cookie("_rpuid", userId) // RPUID - Reset Pwd User Id
            .render("change-password");

    } catch (error) {
        next(error);
    }
});

app.post("/change-password", validateFields(["password"]), async (request, response, next) => {
    try {
        const { password } = request.body;

        const userId = request.cookies["_rpuid"];

        const token = request.cookies["_rpid"];

        const exists = await PasswordResetToken.findOne({ userId: userId, token: token });

        if (!exists) {
            throw new ApiError("Password reset link has been expired!");
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError("User not found!", 404);
        }

        const isSamePassword = await bcrypt.compare(password, user.password);

        if (isSamePassword) {
            throw new ApiError("New password should be different from the current password!");
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minSymbols: 1,
            minUppercase: 1
        })) {
            throw new ApiError(`Password ${password} is not strong enough! Make sure your password is at least 8 characters long and includes at least one uppercase letter, one lowercase letter, one symbol, and one numeric value.`);
        }

        const hashed = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(userId, { password: hashed });
        await PasswordResetToken.findByIdAndDelete(exists._id);
        return response
            .status(200) // change the status code here
            .clearCookie("_rpid")
            .clearCookie("_rpuid")
            .redirect("/dashboard");

    } catch (error) {
        next(error);
    }
});


app.use("*", (request, response) => {
    return response.status(404).render("not-found");
});

app.use((error, request, response, next) => {
    error.formData = request.body;

    const url = request.url.replace("/", "");
    const endpoint = url.split("?")[0];

    if (error instanceof ApiError) {
        return response
            .status(error.statusCode)
            .render(endpoint, { error });
    }

    if (error instanceof AuthError) {
        return response
            .status(error.statusCode)
            .redirect("/login");
    }

    return response
        .status(500)
        .json({
            "code": 500,
            "message": "Internal Server Error!",
            "error": error.message,
            "stackTrace": error.stack
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
