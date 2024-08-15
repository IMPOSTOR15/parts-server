import 'dotenv/config';
import express from 'express';
import sequelize from './src/db';
// import models from './src/models/models';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import router from './src/routes';
import errorHandler from './src/middleware/ErrorHandlingMiddleware';
import path from 'path';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

// Error Handling Middleware
app.use(errorHandler);

const start = async () => {
    try {
        console.log("try start");
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
