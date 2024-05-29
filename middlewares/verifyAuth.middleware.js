import "dotenv/config";
import JWT from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { decodeToken } from "../utils/utils.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export const verifyAuth = ({ tokenType = 'access' } = {}) => {

    return (request, response, next) => {
        try {

            if (tokenType !== 'access' && tokenType !== 'refresh') {
                throw new ApiError(`Invalid input token type (${tokenType})! The token type can either be \'access\' or \'refresh\'.`);
            }

            const token = request.header("Authorization");

            if (!token) {
                throw new ApiError("Authorization Header or token is missing!", 401)
            }

            const { jwtType } = decodeToken(token);

            if (tokenType !== jwtType) {
                throw new ApiError(`Invalid Token type! Only ${tokenType} token is allowed!`);
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