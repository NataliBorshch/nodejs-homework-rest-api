const fs = require("fs/promises");
const path = require("path");
const User = require("../repositories/user");
const UploadAvatar = require("../service/local-upload");
const UploadService = require("../service/cloud-upload");
const {
  Status,
  HttpCode,
  Message,
  createResponse,
} = require("../helpers/constants");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;

const register = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json(
        createResponse(Status.ERROR, HttpCode.CONFLICT, {
          message: Message.EMAIL_USE,
        })
      );
    }
    const { id, name, email, subscription, avatar } = await User.create(
      req.body
    );
    res.status(HttpCode.CREATER).json(
      createResponse(Status.SUCCESS, HttpCode.CREATER, {
        data: { id, name, email, subscription, avatar },
      })
    );
  } catch (e) {
    next(e);
  }
};
const login = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    const isValidPass = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPass) {
      return res.status(HttpCode.UNAUTHORIZED).json(
        createResponse(Status.ERROR, HttpCode.UNAUTHORIZED, {
          message: Message.INVALID__DATA,
        })
      );
    }
    const { id, subscription, avatar } = user;
    const payload = { id, subscription };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
    await User.updateToket(id, token);
    res.status(HttpCode.OK).json(
      createResponse(Status.SUCCESS, HttpCode.OK, {
        data: { id, token, subscription, avatar },
      })
    );
  } catch (e) {
    next(e);
  }
};
const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await User.updateToket(id, null);
    res.status(HttpCode.NO_CONTENT).json({});
  } catch (e) {
    next(e);
  }
};

const current = async (req, res, next) => {
  try {
    const id = await req.user._id;
    const user = await User.findByID(id);
    if (user) {
      res
        .status(HttpCode.OK)
        .json(createResponse(Status.SUCCESS, HttpCode.SUCCESS, { data: user }));
    }

    res
      .status(HttpCode.UNAUTHORIZED)
      .json(Status.UNAUTHORIZED, HttpCode.UNAUTHORIZED, {
        message: Message.UNAUTHORIZED,
      });
  } catch (e) {
    next(e);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const id = req.user._id;
    const newResult = await User.changeSubscription(id, req.body);
    if (newResult) {
      res
        .status(HttpCode.OK)
        .json(
          createResponse(Status.SUCCESS, HttpCode.OK, { data: { newResult } })
        );
    }
    res.status(HttpCode.BAD_REQYEST).json(
      createResponse(Status.BAD_REQYEST, HttpCode.BAD_REQYEST, {
        message: Message.BAD_REQYEST,
      })
    );
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const upload = new UploadAvatar(AVATAR_OF_USERS);
    const urlAvatar = await upload.saveAvatar({
      idUser: id,
      file: req.file,
    });
    try {
      fs.unlink(path.join(AVATAR_OF_USERS, req.user.avatar));
    } catch (error) {
      console.log(error.message);
    }
    await User.updateAvatar(id, urlAvatar);
    return res
      .status(HttpCode.OK)
      .json(
        createResponse(Status.SUCCESS, HttpCode.OK, { data: { urlAvatar } })
      );
  } catch (error) {
    next(error);
  }
};
// cloud avatar
// const avatars = async (req, res, next) => {
//   try {
//     const id = req.user.id;
//     const upload = new UploadService();
//     const { urlAvatar, cloudAvatar } = await upload.saveAvatar(
//       req.file.path,
//       req.user.cloudAvatar
//     );
//     await fs.unlink(req.file.path);
//     await User.updateAvatar(id, urlAvatar, cloudAvatar);
//     return res
//       .status(HttpCode.OK)
//       .json(
//         createResponse(Status.SUCCESS, HttpCode.OK, { data: { urlAvatar } })
//       );
//   } catch (error) {
//     next(error);
//   }
// };
module.exports = {
  register,
  login,
  logout,
  current,
  updateSubscription,
  avatars,
};
