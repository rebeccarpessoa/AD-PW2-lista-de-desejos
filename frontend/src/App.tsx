import { useEffect, useState } from 'react'
import './App.css'
import { ListItems } from './components/ListItems';
import { ItemForm } from './components/ItemForm';
import type { Item, ItemFormData } from './schemas';
import { About } from './components/About';
import { ItemModal } from './components/ItemModal';
import { createItem, deleteItem, fetchItems, updateItem } from './lib/api';

// Arquivo principal da aplicação

function App() {
  // Estado que guarda em qual página a aplicação está
  const [page, setPage] = useState<'lista-itens' | 'cadastrar-itens' | 'sobre-equipe'>('lista-itens');

  // Estado que guarda qual o item aberto no modal (id) e qual está sendo editado
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [actionError, setActionError] = useState("");

  // Listar: busca todos os itens na API
  useEffect(() => {
    let cancelled = false;

    fetchItems()
      .then((data) => {
        if(!cancelled) setItems(data);
      })
      .catch((e) => {
        if(!cancelled) setLoadError(e instanceof Error ? e.message : "Erro ao carregar os itens.");
      })
      .finally(() => {
        if(!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [reloadKey]);

  function handleRetryLoad(){
    setLoadError("");
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  }

  function goToPage(newPage: typeof page){
    setEditingItem(null);
    setActionError("");
    setPage(newPage);
  }

  // Criar / Atualizar (depende de existir um item em edição)
  async function handleSaveItem(data: ItemFormData){
    if(editingItem){
      const updated = await updateItem(editingItem.id, data);
      setItems((prev) => prev.map((item) => item.id === updated.id ? updated : item));
    } else {
      const created = await createItem(data);
      setItems((prev) => [created, ...prev]);
    }
    goToPage('lista-itens');
  }

  // Remover
  async function handleDeleteItem(item: Item){
    if(!window.confirm(`Deseja excluir "${item.name}"?`)) return;

    setActionError("");
    try{
      await deleteItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setSelectedItemId(null);
    } catch(e){
      setActionError(e instanceof Error ? e.message : "Erro ao excluir o item.");
    }
  }

  function handleEditItem(item: Item){
    setSelectedItemId(null);
    setActionError("");
    setEditingItem(item);
    setPage('cadastrar-itens');
  }

  async function handleSwitchPublished(item: Item){
    setActionError("");
    try{
      const updated = await updateItem(item.id, {
        name: item.name,
        description: item.description ?? "",
        isPublished: !item.isPublished,
        image: null,
      });
      setItems((prev) => prev.map((i) => i.id === updated.id ? updated : i));
    } catch(e){
      setActionError(e instanceof Error ? e.message : "Erro ao atualizar o item.");
    }
  }

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  // Função que decique qual página rendenizar
  function renderPage(){
    switch(page){
      case 'cadastrar-itens':
        return <ItemForm key={editingItem?.id ?? 'new'} item={editingItem} onSubmitItem={handleSaveItem} />;
      case 'sobre-equipe':
        return <About/>;
      case 'lista-itens':
      default:
        return <ListItems 
          items={items}
          isLoading={isLoading}
          loadError={loadError}
          onRetry={handleRetryLoad}
          onDeleteItem={handleDeleteItem}
          onEditItem={handleEditItem}
          onNavigatetoItem={() => {goToPage('cadastrar-itens')}}
          onOpenModal={setSelectedItemId}
        />;
    }
  }
      
    
  return (
    <>
      <div className="container">
        <div className='appHeader'>
          <h1>
            {page === 'lista-itens' && "Lista de Desejos"}
            {page === 'cadastrar-itens' && (editingItem ? "Editar Item" : "Cadastrar Item")}
            {page === 'sobre-equipe' && 'Sobre a equipe'}
          </h1>
        </div>

        <div className="appMainContent">
          {actionError && <p style={{color: 'red', marginBottom: 10 }}>{actionError}</p>}
          {renderPage()}
        </div>

          <div className='appBottomNavBar'>
            <div 
              className={`pageElement ${page == 'lista-itens'? 'activePage': ''}`}
              onClick={() => {goToPage('lista-itens')}}
            >
              <span>📋</span>
            </div>

            <div 
              className={`pageElement ${page == 'cadastrar-itens'? 'activePage': ''}`} 
              onClick={() => {goToPage('cadastrar-itens')}}
            >
              <span>✍️</span>
            </div>

            <div 
              className={`pageElement ${page == 'sobre-equipe'? 'activePage': ''}`} 
              onClick={() => {goToPage('sobre-equipe')}}
            >
              <span>🏫</span>
            </div>
          </div>
      </div>
      {selectedItem &&(
        <ItemModal 
          item={selectedItem}
          onClose={() => setSelectedItemId(null)}
          onSwitchPublished={handleSwitchPublished}
          onEditItem={handleEditItem}
        />
      )}  
    </>
  )
}

export default App
