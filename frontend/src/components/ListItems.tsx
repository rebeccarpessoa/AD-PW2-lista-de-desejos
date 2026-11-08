import { PlusIcon } from "@phosphor-icons/react";
import type { Item } from "../schemas";
import './ListItems.css'

interface ListItemsProps {
  items: Item[];
  isLoading: boolean;
  loadError: string;
  onRetry: () => void;
  onDeleteItem: (item: Item)=> void;
  onEditItem: (item: Item)=> void;
  onNavigatetoItem: ()=> void;
  onOpenModal: (id: number) => void;
}

export function ListItems({items, isLoading, loadError, onRetry, onDeleteItem, onEditItem, onNavigatetoItem, onOpenModal}: ListItemsProps){

   if(isLoading){
      return (
         <div className="emptyListContainer">
            <h2>Carregando...</h2>
         </div>
      )
   }

   if(loadError){
      return (
         <div className="emptyListContainer">
            <h2>{loadError}</h2>
            <button className="retryButton" onClick={onRetry}>Tentar novamente</button>
         </div>
      )
   }

   return(
      <div className='divListItems'>
         {items.map((item) => {
            return (
               <div className='divItem' key={item.id}>
                  {item.image && <img className="itemThumb" src={item.image} alt={item.name} />}

                  <div onClick={() => onOpenModal(item.id)}>
                     <div>
                        <h3>{item.name}</h3>
                        <span>{item.isPublished ? '🌐 Publicado' : '🔒 Privado'}</span>
                     </div>
                     <div>
                        <span className="itemDescription">{item.description}</span>
                        <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                     </div> 
                  </div>

                  <div className="itemActions">
                     <button className="editButton" onClick={() => onEditItem(item)} title="Editar item">✏️</button>
                     <button className="deleteButton" onClick={() => onDeleteItem(item)} title="Excluir item">🗑️</button>
                  </div>
               </div>
            )
         })}

         {items.length === 0 && (
            <div className="emptyListContainer">
               <h2>Adicione novos itens</h2>
               <button className="addButton" onClick={()=> onNavigatetoItem()} title="Cadastrar novo item">
                  <PlusIcon size={48} weight="bold" />
               </button>
            </div>
         )}

      </div>
   )
}
