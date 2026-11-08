import type { Request, Response } from "express";
import { db } from "../lib/db/client.js";
import { items } from "../lib/db/schema.js";
import { desc, eq } from 'drizzle-orm';
import { neon } from "files-sdk/neon";
import {Files} from "files-sdk"

const files = new Files({ adapter: neon({bucket: "images"}) });

async function uploadImage(file: Express.Multer.File): Promise<string> {
   const key = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
   await files.upload(key, file.buffer, {contentType: file.mimetype});

   return `${process.env.AWS_ENDPOINT_URL_S3}/images/${key}`;
}

export const getAll = async (
   _req: Request,
   _res: Response
) => {
   try{
      const allItems = await db
         .select()
         .from(items)
         .orderBy(desc(items.createdAt))

      return _res.status(200).json(allItems);

   } catch(e){
      console.error(e);
      return _res.status(500).json({error: "Erro ao buscar os itens."});
   }
};

export const createItem = async (
   _req: Request,
   _res: Response
) => {
   try{
      const {name, description, isPublished} = _req.body;
      const file = _req.file;

      if(!name || !String(name).trim()){
         return _res.status(400).json({error: "O campo 'name' é obrigatório."});
      }

      const imageUrl = file ? await uploadImage(file) : null;

      const [newItem] = await db.insert(items)
         .values({
            name: String(name).trim(),
            description: description || null,
            image: imageUrl,
            isPublished: isPublished === "true" || isPublished === true,
         }).returning();

      return _res.status(201).json(newItem);
   } catch(e){
      console.error("Erro no createItem: ", e);
      return _res.status(500).json({ error: "Erro interno ao criar o item."});
   }
}

export const updateItem = async (
   _req: Request,
   _res: Response
) => {
   try {
      const {name, description, isPublished} = _req.body;
      const file = _req.file;
      const itemId = Number(_req.params.id);

      if(!Number.isInteger(itemId)){
         return _res.status(400).json({error: "Id inválido."});
      }

      if(!name || !String(name).trim()){
         return _res.status(400).json({error: "O campo 'name' é obrigatório."});
      }

      // Só troca a imagem se uma nova foi enviada; senão mantém a atual.
      const imageUrl = file ? await uploadImage(file) : undefined;

      const [updatedItem] = await db.update(items)
         .set({
            name: String(name).trim(),
            description: description || null,
            ...(imageUrl && { image: imageUrl }),
            isPublished: isPublished === "true" || isPublished === true,
         })
         .where(eq(items.id, itemId))
         .returning();

      if(!updatedItem){
         return _res.status(404).json({error: "Item não encontrado."});
      }

      return _res.status(200).json(updatedItem);

   } catch (e) {
      console.error("Erro no updateItem: ", e);
      return _res.status(500).json({error: "Erro interno ao atualizar item."});
   }
}


export const deleteItem = async (
   _req: Request,
   _res: Response
)=>{
   try {
      const itemId = Number(_req.params.id);

      if(!Number.isInteger(itemId)){
         return _res.status(400).json({error: "Id inválido."});
      }

      const [deletedItem] = await db.delete(items)
         .where(eq(items.id, itemId))
         .returning();

      if(!deletedItem){
         return _res.status(404).json({error: "Item não encontrado."});
      }

      return _res.status(200).json(deletedItem);

   } catch (e) {
      console.error("Erro ao deletar item: ", e);
      return _res.status(500).json({error: "Erro interno ao deletar item."});
   }
}





