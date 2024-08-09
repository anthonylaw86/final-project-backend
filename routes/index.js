const express = require("express");
const router = express.Router();

// const router = require("express").Router();
const { createUser, loginUser } = require("../controllers/users");
const { authorization } = require("../middleware/auth");
const {
  validateUserLogin,
  validateUserInfo,
} = require("../middleware/validation");
const { NotFoundError } = require("../utils/Errors/notFoundError");

const musicCardRouter = require("./musicCard");
const userRouter = require("./user");

router.use("/users", authorization, userRouter);

router.use("/items", musicCardRouter);

router.post("/signin", validateUserLogin, loginUser);

router.post("/signup", validateUserInfo, createUser);

router.use((req, res, next) => next(new NotFoundError("Router not found")));

module.exports = router;
