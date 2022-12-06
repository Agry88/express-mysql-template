import { Sequelize } from 'sequelize';

// Database configuration
if (!process.env.DB_NAME ||
     !process.env.DB_USER ||
      !process.env.DB_PASSWORD ||
       !process.env.DB_HOST ||
        !process.env.DB_PORT) {
    throw new Error("Database configuration not found");
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {

    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: "mysql",
    timezone:"+08:00"

});

export default sequelize