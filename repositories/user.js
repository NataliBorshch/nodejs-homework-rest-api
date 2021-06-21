const User = require("../model/schemaUser");

const findByID = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (body) => {
  const user = await new User(body);
  return await user.save();
};

const updateToket = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateToketisVerify = async (id, isVerified, verifyToken) => {
  return await User.updateOne({ _id: id }, { isVerified, verifyToken });
};
const changeSubscription = async (id, newSub) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { ...newSub },
    { new: true }
  );
  return result;
};

const updateAvatar = async (userId, file, cloudAvatar = null) => {
  const result = await User.updateOne(
    { _id: userId },
    { avatar: file, cloudAvatar }
  );
  return result;
};

const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken });
};

module.exports = {
  findByID,
  findByEmail,
  create,
  updateToket,
  updateAvatar,
  changeSubscription,
  updateToketisVerify,
  findByVerifyToken,
};
