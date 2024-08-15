class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message); // Pass the message to the base Error class
        this.status = status;
    }

    static badRequest(message: string): ApiError {
        return new ApiError(404, message);
    }

    static internal(message: string): ApiError {
        return new ApiError(500, message);
    }

    static forbidden(message: string): ApiError {
        return new ApiError(403, message);
    }
}

export default ApiError;
