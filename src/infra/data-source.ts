import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv'

dotenv.config()

const DB_TYPE: any = process.env.DB_TYPE;
const DB_HOST: any = process.env.DB_HOST;
const DB_PORT: any = process.env.DB_PORT;
const DB_USERNAME: any = process.env.DB_USERNAME;
const DB_PASSWORD: any = process.env.DB_PASSWORD;
const DB_NAME: any = process.env.DB_NAME;

const appDataSource = new DataSource({
    type: DB_TYPE,
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [`${__dirname}/entities/*.{ts,js}`],
    migrations: [`${__dirname}/migrations/*.{ts,js}`],
    synchronize: false
});

export default appDataSource;