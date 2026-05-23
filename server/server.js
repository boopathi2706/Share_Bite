const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/dbConfig");
const userRoutes = require("./src/routes/UserRoutes");
const postRoutes = require("./src/routes/PostRoute");
const requestRoutes = require("./src/routes/requestRoute");

const app=express();
app.use(cors());
app.use(express.json());


connectDB();

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/requests', requestRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
