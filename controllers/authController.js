import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";

const register = async (req, res) => {
  // checking for empty values in the controller:
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  // checking for duplicate email:
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({
      user: { // to avoid sending the password back to the frontend (select: false in the model does not work with User.create()):
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
      },
      token,
    });
};

const login = async (req, res) => {
  res.send("login user");
};

const updateUser = async (req, res) => {
  res.send("update user");
};

export { register, login, updateUser };
