const express = require('express'); // Nhập khẩu thư viện Express.
const router = express.Router(); // Tạo một đối tượng Router mới từ Express để quản lý các tuyến đường.
const userController = require('../controls/userController'); // Nhập khẩu userController để xử lý logic đăng ký và đăng nhập.

// Định nghĩa tuyến đường
router.post('/register', userController.registerUser); // Định nghĩa tuyến đường POST cho đăng ký người dùng.
// Khi có yêu cầu đến /register, gọi hàm registerUser từ userController để xử lý.

router.post('/login', userController.loginUser); // Định nghĩa tuyến đường POST cho đăng nhập người dùng.
// Khi có yêu cầu đến /login, gọi hàm loginUser từ userController để xử lý.

module.exports = router; // Xuất khẩu đối tượng router để sử dụng trong ứng dụng Express chính.
