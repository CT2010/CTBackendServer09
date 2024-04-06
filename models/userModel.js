// models/account.js
// Mô tả kiểu dữ liệu của account

const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  // Các trường thông tin khác của người dùng có thể được thêm vào đây
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
