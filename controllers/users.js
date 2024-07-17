const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const { BadRequestError } = require("../utils/Errors/badRequestError");
const { NotFoundError } = require("../utils/Errors/notFoundError");
const { ConflictError } = require("../utils/Errors/conflictError");
const { UnauthorizedError } = require("../utils/Errors/unauthorizedError");

// CREATE USER

const createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!email) {
    next(new BadRequestError("Email is required"));
  }

  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      next(new ConflictError("User Already Exists"));
    }
    return bcrypt
      .hash(password, 10)
      .then((hashedPassword) =>
        User.create({
          username,
          email,
          password: hashedPassword,
        })
      )
      .then(() => res.status(201).send({ username, email, password }))
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          next(new ConflictError("Email already exists"));
        }
        if (err.name === "ValidationError") {
          next(new BadRequestError("Invalid data"));
        }
        next(err);
      });
  });
};

// GET USER BY ID

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

// USER LOGIN

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Email & Password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "30d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Unauthorized"));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  loginUser,
};
