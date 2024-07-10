import JWT from "jsonwebtoken";
import { createHmac } from "crypto";
import "dotenv/config";

import { SMTPClient } from "emailjs";
import { VerificationToken } from "../models/verification.token.model.js";
import { log } from "console";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";


const _generateJwt = ({ _id, firstName, lastName, email, expiresIn }) => {
    return JWT.sign(
        {
            _id,
            firstName,
            lastName,
            email,
        },
        JWT_SECRET,
        {
            expiresIn: expiresIn
        }
    );
}

export const getAuthToken = ({ _id, firstName, lastName, email }) => {
    const authToken = _generateJwt(
        {
            _id: _id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            expiresIn: "12h",
        },
    );

    return authToken;
}

export const decodeToken = (token) => {
    return JWT.decode(token, JWT_SECRET);
}

export const generateVerficationLink = async ({ userId, endpoint }) => {
    const token = createHmac("sha256", "SECRET").digest("hex");
    const link = `http://localhost:8080/${endpoint}?userId=${userId}&token=${token}`;
    return { token, link };
}

export const sendEmailToClient = async ({ email, link }) => {
    // const client = new SMTPClient({
    //     user: '',
    //     password: '',
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     ssl: true
    // });

    // try {
    //     const message = await client.sendAsync({
    //         text: link,
    //         from: '',
    //         to: email,
    //         subject: 'Verification Link',
    //     });
    //     console.log(message);
    // } catch (err) {
    //     console.error(err);
    // }
}

