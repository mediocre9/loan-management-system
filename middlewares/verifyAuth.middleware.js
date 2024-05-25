import { ApiError } from "../utils/apiError.js";
import "dotenv/config";
import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export const verifyAuth = () => {
    return (request, response, next) => {
        try {
            const token = request.header("Authorization");

            if (!token) {
                throw new ApiError("Authorization Header or token is missing!", 401)
            }

            JWT.verify(token, JWT_SECRET, (err) => {
                if (err) {
                    throw new ApiError("Invalid or expired token!", 401);
                }
            });

            request.token = token;
            return next();
        } catch (error) {
            next(error);
        }
    }
}