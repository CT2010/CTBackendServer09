// visController.js
// phần getOne: lấy dữ liệu bình thường thì sẽ được trả về, phần method toJson bị lỗi trong Model
const fs = require('fs');
const csv = require('csv-parser');
const multer = require('multer');

const VisModel = require('../models/visModel');
// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Destination folder for storing uploaded files



/**
 * Registers a new location in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the location is registered successfully.
 * @throws {Error} - If there is an internal server error.
 */
const registerLocation = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
    // Kiểm tra xem vị trí có tồn tại trong cơ sở dữ liệu không
    const existingLocation = await VisModel.findOne({ name });
    if (existingLocation) {
      // Nếu đã tồn tại vị trí với cùng tên, trả về lỗi 409 Conflict
      return res.status(409).json({ message: 'Location with the same name already exists' });
    }
    // Nếu không có vị trí nào tồn tại với cùng tên, tiếp tục lưu vị trí mới
    const newLocation = new VisModel({ name, latitude, longitude });
    await newLocation.save();
    res.status(201).json({ message: 'Location registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Hàm nhận đăng ký địa điểm (gồm name, lat, long) theo danh sách được lưu từ file csv bên angular chuyển qua
const registerAllLocation = async (req, res) => {
  
};


/**
 * Deletes a location from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the location is deleted.
 */
const deleteLocation = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.params;
    const delLocation = await VisModel.findOneAndDelete({ name, latitude, longitude });

    if (delLocation) {
      res.status(200).json({ message: 'Location deleted successfully', delLocation });
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


/**
 * Retrieves a single location based on the provided name, latitude, and longitude.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the location is retrieved and sent as a response.
 */
const getOne = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.params;
    const location = await VisModel.findOne({ name });
    if (location) {
      const formatLocation = location;//location.toJSON;
      res.status(200).json(formatLocation);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

 
/**
 * Retrieves all locations from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the retrieved locations.
 */
const getAll = async (req, res) => {
  try {
    const locations = await VisModel.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
 
/**
 * Retrieves all locations from the database.
 * Hàm trả về toàn bộ thông tin địa điểm
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the locations are retrieved.
 */
const getAllLocation = async (req, res) => {
  try {
    const locations = await VisModel.find({}, 'name latitude longitude');
    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateListData = async (req, res) => {
  
};

/**
 * Updates the data for a specific location.
 * Hàm cập nhật dữ liệu theo thông tin địa điểm đã có đăng ký
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the data is updated.
 */
const updateData = async (req, res) => {
  try {
    const { name, latitude, longitude, data } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !latitude || !longitude || !data) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    // Tìm địa điểm theo tên và tọa độ
    let existingVisData = await VisModel.findOne({ name, latitude, longitude });

    if (existingVisData) {
      const newDataTimestamp =  data.timestamp;
      res.status(200).json({ message: 'Checking ...'}, newDataTimestamp);
      // return
      let dataItemIndex = existingVisData.data.findIndex(dataItem =>
        isSameDate(new Date(dataItem.timestamp), newDataTimestamp),
        
      );

      // Kiểm tra và cập nhật dữ liệu
      if (dataItemIndex !== -1) {
        existingVisData.data[dataItemIndex] = data; // Cập nhật dữ liệu
        await existingVisData.save();
        res.status(200).json({ message: 'Cập nhật dữ liệu thành công', updatedData: data });
      } else {
        // Nếu không có dữ liệu cho ngày đó
        res.status(404).json({ message: 'Không tìm thấy dữ liệu cho ngày chỉ định để cập nhật' });
      }
    } else {
      // Nếu không tìm thấy địa điểm
      res.status(404).json({ message: 'Dữ liệu chưa có địa điểm này' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


/**
 * Adds data to the server.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the data is added successfully.
 * @throws {Error} - If there is an error while adding the data.
 */
const addData = async (req, res) => {
  try {
    const resdata = req.body;
    if (!resdata || !resdata.name || !resdata.data) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
    console.log("Data nhận được: ", resdata.name);

    let existingVisData = await VisModel.findOne({ name: resdata.name, latitude: resdata.latitude, longitude: resdata.longitude });

    if (existingVisData) {
      const newDataTimestamp = new Date(resdata.data[0].timestamp);
      if (existingVisData.data.some(dataItem => isSameDate(new Date(dataItem.timestamp), newDataTimestamp))) {
        console.log(`Dữ liệu đã tồn tại cho ngày ${newDataTimestamp.toLocaleDateString()}`);
        return res.status(409).json({ message: `Dữ liệu đã tồn tại cho ngày ${newDataTimestamp.toLocaleDateString()}` });
      } else {
        existingVisData.data.push(resdata.data[0]);
        await existingVisData.save();
        res.status(200).json({ message: 'Cập nhật dữ liệu thành công', upData: resdata });
      }
    } else {
      console.log(`Dữ liệu chưa có địa điểm này`);
      // Có thể thêm logic tạo mới địa điểm ở đây nếu cần
      res.status(404).json({ message: 'Dữ liệu chưa có địa điểm này' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


/**
 * Updates the data in the database based on the request body.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the data is updated.
 */
const updateDatav1 = async (req, res) => {
  try {
    const resdata = req.body;
    if (!resdata || !resdata.name || !resdata.data) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
    console.log("Data nhận được: ", resdata.name);

    let existingVisData = await VisModel.findOne({ name: resdata.name, latitude: resdata.latitude, longitude: resdata.longitude });

    if (existingVisData) {
      const newDataTimestamp = new Date(resdata.data[0].timestamp);
      existingVisData.data.push(resdata.data[0]);
      await existingVisData.save();
      res.status(200).json({ message: 'Cập nhật dữ liệu thành công', upData: resdata });
    } else {
      console.log(`Dữ liệu chưa có địa điểm này`);
      // Có thể thêm logic tạo mới địa điểm ở đây nếu cần
      res.status(404).json({ message: 'Dữ liệu chưa có địa điểm này' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Hàm kiểm tra xem hai ngày có cùng ngày tháng năm không
function isSameDate(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

module.exports = { registerLocation, registerAllLocation, deleteLocation, getOne, getAll, getAllLocation, updateData, updateDatav1, addData };
