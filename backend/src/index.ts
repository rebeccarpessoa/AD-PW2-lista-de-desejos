import express, {type Express} from "express";
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();

// import { login } from "./controllers/authControllers.js";
import cors from "cors";
import { itemRouter } from './routes/itemRoutes.js'



const app: Express = express();

app.use(cors({ origin: process.env.FRONTEND_URL || true }));

// app.use('/api/v1/auth', login);
app.use('/api/v1/items', itemRouter);


// Na Vercel o app é exportado e servido como função; o listen só vale para rodar localmente
if(!process.env.VERCEL){
   app.listen(process.env.PORT, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
   })
}

export default app;




/*
PERFIL
POST    /login


WISHLIST
POST     /create-wishlist
DELETE   /delete-wishlist


ITEM
GET      /           -> Get all items from a wishlist
POST     /           -> Create item
PUT      /{id}       -> Edit item
DELETE   /{id}       -> Delete item



# ---------------------------------------

PERFIL
id
nome


WISHLIST
id
nome

ITEM 
id
name
description 
image



*/