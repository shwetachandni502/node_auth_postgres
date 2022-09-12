import express from 'express';
import { errorHandler } from '../helpers/errorHandler.js'
import user from '../controller/user.controller.js';
import auth from '../middlewares/auth.js';

export const userRoutes = express.Router();

userRoutes.post('/login' ,errorHandler(user.login));
userRoutes.post('/register' ,errorHandler(user.createUser));
