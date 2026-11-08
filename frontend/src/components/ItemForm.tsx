import { useState } from "react";
import { z } from "zod";
import { itemFormSchema, MAX_IMAGE_SIZE_MB, type Item, type ItemFormData } from "../schemas";
import './ItemForm.css'

interface ItemFormProps{
   // Quando recebe um item, o formulário funciona em modo de edição
   item?: Item | null;
   onSubmitItem: (data: ItemFormData) => Promise<void>;
}

type FieldErrors = Partial<Record<keyof ItemFormData, string[]>>;

export function ItemForm({item, onSubmitItem}: ItemFormProps){
   const [inputName, setInputName] = useState<string>(item?.name ?? "");
   const [inputDescription, setInputDescription] = useState<string>(item?.description ?? "");
   const [inputImage, setInputImage] = useState<File | null>(null);
   const [inputIsPublished, setInputIsPublished] = useState<boolean>(item?.isPublished ?? false);

   const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
   const [errorMessage, setErrorMessage] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   async function handleOnSubmitItemForm(e: React.FormEvent<HTMLFormElement>){
      e.preventDefault();

      const result = itemFormSchema.safeParse({
         name: inputName,
         description: inputDescription,
         isPublished: inputIsPublished,
         image: inputImage,
      });

      if(!result.success){
         setFieldErrors(z.flattenError(result.error).fieldErrors);
         setErrorMessage("Dados inválidos!");
         return;
      }

      setFieldErrors({});
      setErrorMessage("");
      setIsSubmitting(true);

      try{
         await onSubmitItem(result.data);
      } catch(e){
         setErrorMessage(e instanceof Error ? e.message : "Erro ao salvar o item.");
         setIsSubmitting(false);
      }
   }

   return (
      <div className='divSignItem'>
         <form onSubmit={handleOnSubmitItemForm} noValidate>
            <label htmlFor="item-name">Nome</label>
            <input 
               id="item-name"
               type="text" 
               placeholder='Nome do item' 
               value={inputName} 
               onChange={(e) => setInputName(e.target.value)}
            />
            {fieldErrors.name && <span className="fieldError">{fieldErrors.name[0]}</span>}

            <label htmlFor="item-description">Descrição</label>
            <textarea 
               id="item-description"
               placeholder="Escreva sobre o item..."
               value={inputDescription}
               onChange={(e) => setInputDescription(e.target.value)}
            />
            {fieldErrors.description && <span className="fieldError">{fieldErrors.description[0]}</span>}

            <label htmlFor="item-image">Imagem (até {MAX_IMAGE_SIZE_MB}MB)</label>
            {item?.image && (
               <img className="currentImage" src={item.image} alt={`Imagem atual de ${item.name}`} />
            )}
            <input 
               id="item-image"
               type="file" 
               accept="image/*"
               onChange={(e) => setInputImage(e.target.files?.[0] ?? null)}
            />
            {item?.image && <small className="helperText">Deixe em branco para manter a imagem atual.</small>}
            {fieldErrors.image && <span className="fieldError">{fieldErrors.image[0]}</span>}

            <label className="checkboxRow" htmlFor="item-published">
               <input 
                  id="item-published"
                  type="checkbox" 
                  checked={inputIsPublished}
                  onChange={(e) => setInputIsPublished(e.target.checked)}
               />
               Publicado
            </label>

            {errorMessage && <span style={{color: 'red', margin: 10 }}>{errorMessage}</span>}

            <button type="submit" disabled={isSubmitting}>
               {isSubmitting ? "Salvando..." : item ? "Salvar alterações" : "Cadastrar +"}
            </button>
         </form>
      </div>
   )
}
