import CustomAPIError from './custom-api.js'
import { StatusCodes } from "http-status-codes";

export default class badRequestError extends CustomAPIError {
    constructor(message) {
      super(message);
      this.statusCode = StatusCodes.BAD_REQUEST;
    }
  }
  