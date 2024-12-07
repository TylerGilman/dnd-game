import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(__dirname, '../../.env')});

const envOrDefault = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (value) return value;
    if (defaultValue) return defaultValue;
    throw new Error(`${key} is not defined and no default value was provided.`);
};

export const config = {
    port: envOrDefault('PORT', '3000'),
    mongoUri: envOrDefault('MONGODB_URI', 'mongodb://localhost:27017/dnd-game'),
    jwtSecret: envOrDefault('JWT_SECRET'),
    nodeEnv: envOrDefault('NODE_ENV', 'development'),
    clientUrl: envOrDefault('CLIENT_URL', 'http://localhost:5173')
};
