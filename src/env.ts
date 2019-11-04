import { config } from 'dotenv';

config();

const env = {
  dbHost: process.env.DB_HOST,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_NAME,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  host: process.env.HOST,
  apiKey: process.env.API_KEY,
  thumbnailSize: process.env.THUMBNAIL_SIZE,
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
  sxcu: process.env.SXCU,
  uploadUrl: process.env.UPLOAD_URL,
  returnUrl: process.env.RETURN_URL,
};

export default env;
