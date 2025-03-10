import express from 'express';
import router from './routes/routes.js';
import cors from "cors";

const app = express();
//middlewares
app.use(express.json());
app.use(cors())

//routes
app.use(router);

//server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});