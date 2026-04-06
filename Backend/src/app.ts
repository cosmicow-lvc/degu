import express from 'express';
import holaRoutes from './routes/hola.routes';

const app = express();


app.use(express.json());


app.use('/api', holaRoutes);

export default app;