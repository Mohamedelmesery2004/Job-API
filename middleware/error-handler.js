import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../errors/custom-api.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    msg: err.message || "something went wrong",
    statusCode: err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.code && err.code === 11000) {
    customError.msg = "duplicate for the value please try anothor one";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode=StatusCodes.BAD_REQUEST;
  }
   if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
