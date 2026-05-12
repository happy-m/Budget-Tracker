import { api } from './client'
import type { Category, EntryType, Subcategory } from '../types'

export const categoriesApi = {
  list: (type: EntryType) => api.get<Category[]>(`/categories?type=${type}`),
  create: (body: { type: EntryType; name: string }) =>
    api.post<Category>('/categories', body),
  update: (id: number, body: { name?: string; displayOrder?: number }) =>
    api.patch<Category>(`/categories/${id}`, body),
  delete: (id: number) => api.delete<void>(`/categories/${id}`),
}

export const subcategoriesApi = {
  list: (categoryId: number) =>
    api.get<Subcategory[]>(`/subcategories?categoryId=${categoryId}`),
  create: (body: { categoryId: number; name: string }) =>
    api.post<Subcategory>('/subcategories', body),
  update: (id: number, body: { name?: string; displayOrder?: number }) =>
    api.patch<Subcategory>(`/subcategories/${id}`, body),
  delete: (id: number) => api.delete<void>(`/subcategories/${id}`),
}
