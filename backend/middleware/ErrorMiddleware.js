import dotenv from "dotenv";
dotenv.config();

// Fallback error handler for invalid routes
const notFoundHandler = (req, res, next) => {
  const notFoundError = new Error(`Not Found : '${req.originalUrl}'`);
  res.status(404);
  next(notFoundError);
};

const appErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const status = `${statusCode}`.startsWith("4")
    ? "Client error"
    : "Server error";

  res.status(statusCode).json({
    status,
    message: err.message,
  });
};

export { notFoundHandler, appErrorHandler };
