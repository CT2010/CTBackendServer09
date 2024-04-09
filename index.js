// server.js
const express = require('express'); // Nhập khẩu thư viện Express để tạo máy chủ HTTP
const cors = require('cors'); // Nhập khẩu thư viện CORS để xử lý Cross-Origin Resource Sharing
const bodyParser = require('body-parser'); // Nhập khẩu thư viện bodyParser để phân tích cú pháp dữ liệu gửi từ client
const mongoose = require('mongoose'); // Nhập khẩu thư viện Mongoose để tương tác với MongoDB
const dotenv = require('dotenv'); // Nhập khẩu thư viện dotenv để quản lý các biến môi trường
const routes = require('./routes/accountRoutes'); // Nhập khẩu các tuyến đường cho phần quản lý tài khoản
 
const visRoutes = require('./routes/visdataRoutes'); // Nhập khẩu các tuyến đường cho phần dữ liệu trực quan

const path = require('path');

dotenv.config(); // Tải các biến môi trường từ file .env

const app = express(); // Tạo một đối tượng ứng dụng Express
const port = process.env.PORT; // Lấy cổng từ biến môi trường, nơi máy chủ sẽ lắng nghe
const uri = process.env.MONGODB_URI; // Giả định chuỗi kết nối MongoDB Atlas được lưu trữ trong MONGODB_URI


// Middleware
app.use(cors()); // Sử dụng CORS như một middleware để cho phép các yêu cầu từ các nguồn khác nhau
app.use(bodyParser.json()); // Sử dụng bodyParser để phân tích cú pháp dữ liệu JSON từ yêu cầu
app.use(bodyParser.urlencoded({ extended: true })); // Sử dụng bodyParser để phân tích cú pháp dữ liệu URL-encoded

// Kết nối đến MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas connected')) // Thông báo khi kết nối thành công
  .catch(err => {
    console.error('MongoDB connection error:', err); // Ghi lại lỗi nếu kết nối thất bại
    process.exit(1); // Thoát chương trình với mã lỗi 1
  });

  // Thay 'ang18' bằng đường dẫn tuyệt đối tới thư mục build của Angular, nếu 'ang18' là tên thư mục chứa app Angular
  app.use(express.static(path.join(__dirname, 'ang18/browser')));
  
// Sử dụng các tuyến đường
app.use('/acc', routes); // Sử dụng các tuyến đường quản lý tài khoản tại đường dẫn /acc
app.use('/vis', visRoutes); // Sử dụng các tuyến đường dữ liệu trực quan tại đường dẫn /vis


// Định tuyến lại tất cả các yêu cầu không khớp với API routes tới Angular app
// Đảm bảo rằng đường dẫn tới index.html chính xác
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'ang18', 'index.html')); // Sửa lại dòng này
});

// Bắt đầu máy chủ
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Thông báo trạng thái hoạt động của máy chủ trên cổng đã được chỉ định
});
