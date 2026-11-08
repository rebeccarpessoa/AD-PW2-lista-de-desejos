import express from "express";
import { createItem, getAll, deleteItem, updateItem } from "../controllers/itemController.js";
import multer from "multer";
// import {router} from "express.router";

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.get('/', getAll);
// router.get('/:{id}', getFromId);

router.post('/', upload.single("image"), createItem);

router.put('/:id', upload.single("image"),updateItem);

router.delete('/:id', deleteItem);

export const itemRouter = router;