// Load configs from .env
(() => {
    const { existsSync } = require("fs");
    const { join: pathJoin } = require("path");
    const dotenvPath = pathJoin(__dirname, ".env");
    if (!existsSync(dotenvPath) && !process.env.APP_CONFIGURED) {
        throw new Error(".env not exists");
    }
    require("dotenv").config();
})();

// Create context storage
import sequelize from "./src/init/database"
const ctx = {
    sequelize
};

// Initialize application
import app from "./src/init/express";

// Map routes
import fs = require('fs');
fs.readdir('./src/routes', (err, files) => {
    files.forEach(async(file) => {
        const module = await import('./src/routes/' + file)
        module.default(ctx,app)
    })
})

// Start application
app.listen(
    parseInt(process.env.HTTP_PORT!) || 3000,
    process.env.HTTP_HOST || "0.0.0.0",
    () => console.info("Server boot successful"))