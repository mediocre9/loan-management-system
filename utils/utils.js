import { Token } from "../models/token.model.js";
import crypto from "node:crypto";
import JWT from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export const generateToken = () => {
    return crypto.randomBytes(32).toString("hex");
}

export const generateEmailVerificationLink = async ({ _id }) => {
    const token = generateToken();
    await Token.create({ userId: _id, token: token });
    const verificationLink = `http://localhost:8080/api/verification/${_id}/${token}`;
    return verificationLink;
}

export const generateJwt = ({ _id, email }, expiresIn) => {
    return JWT.sign({ _id, email }, JWT_SECRET, { expiresIn: expiresIn });
}

