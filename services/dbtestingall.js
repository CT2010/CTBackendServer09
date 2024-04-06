// dbtestingall.js : thực hiện các hàm gọi và thao tác với mongoodb cloud
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Account = require('../models/account');

// Connection URI
const uri = process.env.MONGODB_URI_USER;; // Thay thế bằng chuỗi kết nối MongoDB của bạn

// Tên của collection bạn muốn tạo
const collectionName = 'USER21';

async function createCollection() {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
  
      // Tạo collection
      const collection = await mongoose.connection.db.createCollection(collectionName);
      console.log(`Collection '${collectionName}' created successfully`);
    } finally {
      mongoose.connection.close();
      console.log('Connection closed');
    }
  }
  

// Gọi hàm để tạo collection
createCollection();
