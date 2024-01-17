const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const apiKey = process.env.API_KEY; 

// --------------------------------- Sử dụng cors middleware
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.status(200).json('Hello world!') // Gửi phản hồi với nội dung "Hello, world!"
  });
//             --------------------------------












app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });