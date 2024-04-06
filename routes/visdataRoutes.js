const express = require('express'); // Nhập khẩu thư viện Express để xây dựng ứng dụng web.
const router = express.Router(); // Tạo một đối tượng Router để định nghĩa các tuyến đường (routes).
const visController = require('../controls/visController'); // Nhập khẩu visController để xử lý các yêu cầu liên quan đến dữ liệu trực quan.
const multer = require('multer'); // Nhập khẩu thư viện Multer để xử lý việc tải file lên.
const upload = multer({ dest: 'uploads/' }); // Cấu hình Multer để lưu trữ file tải lên trong thư mục 'uploads/'.

// Định nghĩa các tuyến đường
router.post('/register', visController.registerLocation); // Tuyến đường POST để đăng ký một vị trí mới.
router.post('/registerFileCSV', upload.single('file'), visController.registerAllLocation); // Tuyến đường POST cho phép tải lên và đăng ký nhiều vị trí từ một file CSV.
router.post('/upData', visController.addData); // Tuyến đường POST để thêm dữ liệu mới vào hệ thống.
router.post('/updateData', visController.updateDatav1); // Tuyến đường POST để cập nhật dữ liệu đã có.
router.delete('/delLocation/:name/:latitude/:longitude', visController.deleteLocation); // Tuyến đường DELETE để xóa một vị trí dựa trên tên, vĩ độ và kinh độ.
router.get('/getOne/:name/:latitude/:longitude', visController.getOne); // Tuyến đường GET để lấy thông tin của một vị trí cụ thể.
router.get('/getAllLocation', visController.getAllLocation); // Tuyến đường GET để lấy tất cả vị trí đã đăng ký.
router.get('/getAllData', visController.getAll); // Tuyến đường GET để lấy toàn bộ dữ liệu đã đăng ký trong hệ thống.

module.exports = router; // Xuất khẩu router để sử dụng trong các file khác của ứng dụng.
