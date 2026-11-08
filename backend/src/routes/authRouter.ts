import express from "express";
import { login } from "../controllers/authControllers.js";
// import {router} from "express.router";

const router = express.Router();

router.post('/login', login);


module.exports = router;