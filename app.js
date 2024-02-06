const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
require('./db/connection');

const authRoute1 = require('./routers/users');
const authRoute2 = require('./routers/blogs');

app.use('/api/v1', authRoute1, authRoute2);
const ipAddress = '192.168.159.9';

app.listen(PORT, ipAddress, () => {
    console.log(`Server is running on the port ${PORT}`);
})