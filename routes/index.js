import { Router } from 'express';
import { userRoutes } from './user.js';
const routes = Router();

routes.use('/auth', userRoutes);

export default routes;
