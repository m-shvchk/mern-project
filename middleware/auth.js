import { UnauthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  // check if header exists:
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(payload) // {userId: '...', iat: ..., exp: ...}
    req.user = { userId: payload.userId } // we are interested in the userId only
    next();
  } catch (e) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

export default auth;
