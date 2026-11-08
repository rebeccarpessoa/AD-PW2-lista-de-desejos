import { Check, PlusIcon, X } from '@phosphor-icons/react';
import type { Item } from '../schemas'
import './ItemModal.css'

interface ItemModalProps {
   item: Item,
   onClose: () => void;
   onSwitchPublished: (item: Item) => void;
   onEditItem: (item: Item) => void;
}


export function ItemModal({item, onClose, onSwitchPublished, onEditItem}: ItemModalProps){
   return (
      <div className='modalOutside' onClick={onClose}>
         <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
            <button 
               onClick={onClose}
               className="closeModalButton"
            ><X size={24}/></button>
            <div>
               {item.image && <img className="modalImage" src={item.image} alt={item.name} />}

               <div>
                  <div className='headerRow'>
                     <h3>{item.name}</h3>
                     <span>{item.isPublished ? '🌐 Publicado' : '🔒 Privado'}</span>
                  </div>
                  <div className='headerRow'>
                     <span>Criado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div> 
               </div>


               <p>{item.description}</p>

               <button onClick={() => onSwitchPublished(item)} className={`buttonPublish ${item.isPublished ? 'published' : ''} `}>
                  {item.isPublished ? (
                     <>Publicado <Check size={20} /></>
                  ):(   
                     <>Publicar<PlusIcon size={20}/></>
                  )}
               </button>

               <button onClick={() => onEditItem(item)} className="buttonEdit">
                  Editar ✏️
               </button>
            </div>
         </div>
      </div>
   )
}
