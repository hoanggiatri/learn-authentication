const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { testConnection } = require("../helpers/connections_multi_mongodb")

const UserSchema = new Schema({
  email: {
    type: String,
    lowcase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', async function (next) {
  try {
    console.log(`call before save::::`, this.email, this.password);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
})

UserSchema.methods.isCheckPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {

  }
}

module.exports = testConnection.model('users', UserSchema);