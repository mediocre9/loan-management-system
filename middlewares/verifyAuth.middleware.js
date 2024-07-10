import "dotenv/config";
import JWT from "jsonwebtoken";
import { AuthError } from "../utils/authError.js";
import { decodeToken } from "../utils/utils.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export const verifyAuth = () => {
    return (request, _, next) => {
        try {
            const token = request.cookies["_aid"];

            if (!token) {
                throw new AuthError("Authorization Header or token is missing!", 401)
            }

            JWT.verify(token, JWT_SECRET, (err) => {
                if (err) {
                    throw new AuthError("Session Token has expired! Reauthetication required", 403);
                }
            });

            request.token = token;
            request.decoded = decodeToken(token);
            return next();
        } catch (error) {
            next(error);
        }
    }
}