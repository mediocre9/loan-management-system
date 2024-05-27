import { ApiError } from "../utils/apiError.js";


// a library can help use such as [JOI] . . .
export const validateFields = (fields) => {
    return (request, response, next) => {
        try {
            if (!Array.isArray(fields)) {
                throw new ApiError(`Array of fields required to validate!`);
            }
            const missing = fields.filter(e => !request.body[e]);

            if (missing.length > 0) {
                throw new ApiError(`${missing} required!`);
            }
        } catch (error) {
            next(error);
        }
        return next();
    }
}