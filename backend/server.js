require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/business', require('./routes/businessRoutes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));