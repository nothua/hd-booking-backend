import("dotenv");

import express from 'express';
import Mongoose from "mongoose";
import fs from "fs";
import path from "path";
import cors from 'cors';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routesPath = path.join(__dirname, "routes");
const routeFiles = fs.readdirSync(routesPath);

for (const file of routeFiles) {
  if (file.endsWith("Route.ts") || file.endsWith("Route.js")) {
    const routeName = file
      .replace(/Route\.(ts|js)$/, "")
      .toLowerCase();
    
    const routePath = routeName === "index" ? "/" : `/${routeName}`;
    
    const router = require(path.join(routesPath, file)).default;
    app.use(routePath, router);
    
    console.log(`Loaded route: ${routePath} -> ${file}`);
  }
}

try {
    Mongoose.connect(process.env.MONGO_URI || "");

    Mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
    });

    Mongoose.connection.on("disconnected", () => {
        console.log("Disconnected from MongoDB");
    });

} catch (e) {
    console.log(e);
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});