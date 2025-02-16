const express = require('express');
const cors = require('cors')
import { json, urlencoded } from "express";
import { v1Route } from "../routes/v1-route";


const cookieParser = require('cookie-parser')



const mainApp = express();

mainApp
    .disable("x-powered-by")
mainApp.use(urlencoded({ extended: true }))
mainApp.use(json())
mainApp.use(cors())
mainApp.use(cookieParser())
mainApp.options('*', cors())
mainApp.use('/v1', v1Route)


export default mainApp;
