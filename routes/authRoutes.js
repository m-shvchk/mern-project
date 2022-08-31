import express from "express";
const router = express.Router();
import { register, login, updateUser } from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";
import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // requests per 15 min
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// applying request rate limiter only to login and register routes:
router.route("/register").post(apiLimiter, register); 
router.route("/login").post(apiLimiter, login);

router.route("/updateUser").patch(authenticateUser, updateUser);

export default router;
