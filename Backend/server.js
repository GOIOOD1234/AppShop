const express = require("express");
const dotenv = require("dotenv");
const db = require("./confing/db.js")
const cors = require("cors");
// routes
const routesProduct = require("./routes/product.js")
const routesUser = require("./routes/user.js")
const routesAdmin = require("./routes/admin.js")
const routesUserRequest  = require("./routes/userRequest.js")

dotenv.config();

const app = express();
app.use(cors())

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type"], 
  }))
app.use(express.json());

app.use("/api/products",routesProduct)
app.use("/api/user",routesUser)
app.use("/api/admin",routesAdmin)
app.use("/api/userRequest",routesUserRequest)

 

 

app.listen(5000,()=>{
    db.connectDB()
    console.log("1 2 4");
})
