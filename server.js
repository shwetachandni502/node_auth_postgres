import path from 'path';
import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import db from './models/index.js';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import routes from './routes/index.js';
import bodyParser from 'body-parser';

const { PORT } = process.env;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.on('uncaughtException', (err) => console.error(err, err.stack));
process.on('unhandledRejection', (err) => console.error(err, err.stack));

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);

app.use(session({
  secret: process.env.JWT_SECRET_KEY,
  resave: true,
  saveUninitialized: false,
  sameSite: 'strict',
  cookie: { secure: false },
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.req = req;
  next();
});

db.sequelize
  .sync()
  .then(() => console.log('Database connection succeeded'))
  .catch((err) => console.log('Err in db connection', err));

app.use(express.static(path.resolve(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../static')));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

// global error handler
app.use(globalErrorHandler);
const port = PORT || 5000;
app.listen(port, () => console.log(`Server is running on ${port}.....`));
