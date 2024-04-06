// File tạo dữ liệu tự động theo địa điểm và giới hạn ngày đưa vào
// Địa điểm phải được tạo trước, không tạo mới địa điểm
// Khung ngày sẽ được kiểm tra, không để dữ liệu trùng ngày.
// Mỗi ngày là một số liệu


const VisData = require('../models/visModel');
const dotenv = require('dotenv'); // Import dotenv for environment variables
const mongoose = require('mongoose');
dotenv.config();
const uri = process.env.MONGODB_URI; // Assuming your MongoDB Atlas connection string is stored in MONGODB_URI

const uri1 = 'mongodb+srv://schovis:cuong123@cluster0.sltadrt.mongodb.net/vis21'
mongoose.connect(uri1, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Atlas connected');
    // Gọi hàm tạo dữ liệu và sau đó kết thúc quá trình chạy
    createVisData('Huflit-01', 10.779128980496425, 106.66667808566008, '2024-01-01', '2024-12-31').then(() => {
      console.log('Data creation complete');
      process.exit(0); // Exit process successfully
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  });

// Hàm tạo dữ liệu mới theo khoảng thời gian chỉ định
async function createVisData(name, latitude, longitude, startDate, endDate) {
  try {
    // Kiểm tra xem có địa điểm nào đã tồn tại với tên và tọa độ đã cho không
    let existingVisData = await VisData.findOne({ name, latitude, longitude });
    // Nếu địa điểm đã tồn tại, kiểm tra xem ngày tháng năm đã tồn tại trong mảng dữ liệu cảm biến hay chưa
    if (existingVisData) {
      for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
        let currentDate = new Date(date); // Tạo một bản sao của ngày hiện tại trong vòng lặp
        if (existingVisData.data.some(dataItem => isSameDate(dataItem.timestamp, currentDate))) {
          console.log(`Dữ liệu đã tồn tại cho ngày ${currentDate.toLocaleDateString()}`);
        } else {
          existingVisData.data.push({
            timestamp: currentDate,
            sensors: {
              temperature: generateRandomNumber(20, 30),
              humidity: generateRandomNumber(40, 60),
              uvIndex: generateRandomNumber(1, 10)
            }
          });
          // Lưu và cập nhật dữ liệu của địa điểm đã tồn tại
          const result = await existingVisData.save();
          console.log('VisData updated successfully:', result);
        }
      }
    } else {
      console.log('Địa điểm không tồn tại');
    }
  } catch (error) {
    console.error('Error creating VisData:', error);
  }
}



// Hàm tạo số ngẫu nhiên trong khoảng giữa min và max
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Hàm kiểm tra xem hai ngày có cùng ngày tháng năm không
function isSameDate(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}
