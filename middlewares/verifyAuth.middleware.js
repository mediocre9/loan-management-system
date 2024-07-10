import "dotenv/config";
import JWT from "jsonwebtoken";
import { AuthError } from "../utils/authError.js";
import { decodeToken } from "../utils/utils.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export const verifyAuth = ({ tokenType = '_aid' } = {}) => {

    return (request, response, next) => {
        try {
            // if (tokenType !== '_aid' && tokenType !== '_rid') {
            //     throw new AuthError(`Invalid input token type (${tokenType})! The token type can either be \'access\' or \'refresh\'.`);
            // }

            const token = request.cookies["_aid"];

            if (!token) {
                throw new AuthError("Authorization Header or token is missing!", 401)
            }

            // const { jwtType } = decodeToken(token);

            // if (tokenType !== jwtType) {
            //     throw new AuthError(`Invalid Token type! Only ${tokenType} token is allowed!`);
            // }

            JWT.verify(token, JWT_SECRET, (err) => {
                if (err) {
                    throw new AuthError("Invalid or expired token!", 401);
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