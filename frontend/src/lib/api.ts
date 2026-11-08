import { z } from 'zod';
import { itemListSchema, itemSchema, type Item, type ItemFormData } from '../schemas';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const ITEMS_URL = `${API_URL}/api/v1/items`;

const errorBodySchema = z.object({ error: z.string() });

async function request(url: string, init?: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = errorBodySchema.safeParse(body);
    throw new Error(parsed.success ? parsed.data.error : 'Erro inesperado no servidor.');
  }

  return body;
}

function toFormData(data: ItemFormData): FormData {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('isPublished', String(data.isPublished));
  if (data.image) formData.append('image', data.image);
  return formData;
}

export async function fetchItems(): Promise<Item[]> {
  return itemListSchema.parse(await request(ITEMS_URL));
}

export async function createItem(data: ItemFormData): Promise<Item> {
  return itemSchema.parse(await request(ITEMS_URL, { method: 'POST', body: toFormData(data) }));
}

export async function updateItem(id: number, data: ItemFormData): Promise<Item> {
  return itemSchema.parse(
    await request(`${ITEMS_URL}/${id}`, { method: 'PUT', body: toFormData(data) }),
  );
}

export async function deleteItem(id: number): Promise<void> {
  await request(`${ITEMS_URL}/${id}`, { method: 'DELETE' });
}
