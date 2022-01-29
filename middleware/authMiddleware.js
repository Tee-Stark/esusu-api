const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { GetUserById } = require("../services/UserServices");
const { responseHandler } = require("../utils/responseHandler");
const { isJwtExpired } = require("jwt-check-expiration");
const secret = process.env.ESUSU_JWT_SECRET;
const expiresIn = process.env.ESUSU_TOKEN_EXPIRY;

exports.generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, secret, { expiresIn });
};

const decodeToken = (token) => {
  try {
    const isTokenExpired = isJwtExpired(token);
    if (isTokenExpired) {
      throw new Error("Verification token is expired");
    }
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.signinRequired = asyncHandler(async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return responseHandler(res, {
      status: 401,
      message: "Token is missing or expired - Login required!",
      data: null,
    });
  }
  const [bearer, authToken] = token.split(" ");
  if (bearer !== "Bearer") {
    return responseHandler(res, {
      status: 401,
      message: "Invalid token - Bearer token required!",
      data: null,
    });
  }
  let decoded;
  try {
    decoded = decodeToken(authToken);
    if (decoded) {
      const { id } = decoded;
      const user = await GetUserById(id);
      if (user) {
        req.user = user;
        return next();
      } else {
        return responseHandler(res, {
          status: 401,
          message: "Invalid token - User not found!",
          data: null,
        });
      }
    }
  } catch (err) {
    decoded = null;
  }
});

exports.adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return responseHandler(res, {
      status: 401,
      message: "Admin only!",
      data: null,
    });
  }
  return next();
});
