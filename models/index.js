// import { Sequelize } from 'sequelize';
import 'dotenv/config';

import { Sequelize } from "sequelize";
import User from './User.model.js';
const dbName = process.env.DB_NAME ;
const dbUser = process.env.DB_USER ;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbPassword = process.env.DB_PASSWORD;
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
	host: dbHost,
	port: dbPort,
	logging: true,
	dialectOptions: {
		decimalNumbers: true,
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	},
	dialect: 'postgres'
});
const db = {
	sequelize,
	Users: User(sequelize),
	
}

// has many relation


export default db;


