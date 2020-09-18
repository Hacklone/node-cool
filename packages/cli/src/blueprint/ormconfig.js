const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  synchronize: false,
  maxQueryExecutionTime: 1000,
  entities: [`${__dirname}/src/entities/**/*.js`],
  migrations: [`${__dirname}/src/migrations/**/*.js`],
  cli: {
    migrationsDir: `src/migrations`,
  },
};
