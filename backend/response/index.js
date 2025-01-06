export const successResponse = (res, data = null, statusCode = 200) => {
  res.status(statusCode).json({
    isSuccess: true,
    data,
  });
};

export const errorResponse = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    isSuccess: false,
    message,
  });
};
