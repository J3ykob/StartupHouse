import express, {Errback, Request, Response} from 'express';
const app = express();

import bodyParser from 'body-parser';
app.use(bodyParser.json());

import {initDatabase} from './database';
initDatabase();

import ZombiesRouter from './Routes/zombies';
app.use('/zombies', ZombiesRouter);

app.use((error: Errback, _: Request, res: Response, __:any) => {
    console.error(
      `Error processing request ${error}. See next message for details`
    );
    console.error(error);
  
    return res.status(500).json({ error: "internal server error" });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});