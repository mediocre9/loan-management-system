import JWT from "jsonwebtoken";
import otp from "otp-generator";
import "dotenv/config";
import { SMTPClient } from "emailjs";
import { OTP } from "../models/otp.model.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

const _getVerificationCode = async (id) => {
    const code = otp.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    console.log(code)
    await OTP.findOneAndDelete({ userId: id });
    await OTP.create({ userId: id, otp: code });
    return code;
}

const _generateJwt = ({ _id, email }, expiresIn) => {
    return JWT.sign({ _id, email }, JWT_SECRET, { expiresIn: expiresIn });
}

export const getAuthTokens = (user) => {
    const accessToken = _generateJwt(user, '10h');
    const refreshToken = _generateJwt(user, "1d");
    return { accessToken, refreshToken };
}

export const decodeToken = (token) => {
    return JWT.verify(token, JWT_SECRET);
}

export const sendEmailToClient = async ({ _id }) => {
    const otp = await _getVerificationCode(_id);

    console.log(`OTP: ${otp}`);
    // const client = new SMTPClient({
    //     user: 'mirzafahadzia9@gmail.com',
    //     password: 'alnu lhtm lsyx eajr',
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     ssl: true
    // });

    // try {
    //     const message = await client.sendAsync({
    //         text: otp.toString(),
    //         from: 'mirzafahadzia9@gmail.com',
    //         to: 'mirzafahadzia9@gmail.com',
    //         subject: 'Verification Code',
    //     });
    //     console.log(message);
    // } catch (err) {
    //     console.error(err);
    // }
}

