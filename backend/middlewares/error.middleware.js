import { CustomError } from "../utils/errors.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      isSuccess: false,
      message: err.message,
    });
  }

  // Handle generic or uncaught errors
  res.status(500).json({
    isSuccess: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
