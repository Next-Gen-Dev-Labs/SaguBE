import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { services } from './services';
import { port, morgan_mode, connectDbs } from './config';
import { _404ErrorHandler, expressErrorHandler } from './commons';

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan(morgan_mode));

connectDbs();

app.use('/api', services);

app.use(_404ErrorHandler);
app.use(expressErrorHandler);

try {
  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
} catch (error: any) {
  console.error(`An error was encountered at startup: ${error.toString()}`);
}
