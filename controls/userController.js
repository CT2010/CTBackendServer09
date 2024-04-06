// userController.js
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Import dotenv for environment variables
dotenv.config();

const secretKey = process.env.API_KEY;

// Controller function for user registration
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new UserModel({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller function for user login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username, password });
    if (user) {
      // Tạo JWT token
      const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' }); // Token hết hạn sau 1 giờ

      // Gửi thông tin user và token trong phản hồi trong mảng user_res
      const ures = [{ username: user.username, usertoken: token }];
      res.status(200).json({ message: 'Login successful', username: user.username, usertoken: token });
      // res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller function for updating user information
const updateUser = async (req, res) => {
  try {
    const { username } = req.params;
    const { newPassword } = req.body;

    // Assume you want to update the password
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { password: newPassword },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json({ message: 'User updated successfully', updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller function for deleting a user
const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const deletedUser = await UserModel.findOneAndDelete({ username });

    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser };

// 1. Đăng ký User mới  : ok - chưa có xác thực
// 2. Login user        : ok - Trả về thông tin đăng nhập thành công.
