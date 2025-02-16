const express = require('express');
const cors = require('cors')
import { json, NextFunction, Request, Response, urlencoded } from "express";
import { v1Route } from "../routes/v1-route";


const cookieParser = require('cookie-parser')



const mainApp = express();

mainApp.use((req: Request, res: Response, next: NextFunction) => {
  const abortController = new AbortController();
  (req as any).abortController = abortController;

  req.on('aborted', () => {
    console.log('Request aborted (middleware)');
    abortController.abort();
  });
  res.on('close', () => {
    if (!res.writableEnded) {
      console.log('Response closed prematurely (middleware)');
      abortController.abort();
    }
  });

  next();
});

mainApp
    .disable("x-powered-by")
mainApp.use(urlencoded({ extended: true }))
mainApp.use(json())
mainApp.use(cors())
mainApp.use(cookieParser())
mainApp.options('*', cors())
mainApp.use('/v1', v1Route)


export default mainApp;
