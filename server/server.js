const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/dbConfig");
const userRoutes = require("./src/routes/UserRoutes");

const app=express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
