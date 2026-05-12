import { api } from './client'
import type { Category, EntryType, Subcategory } from '../types'

export const categoriesApi = {
  list: (type: EntryType) => api.get<Category[]>(`/categories?type=${type}`),
}

export const subcategoriesApi = {
  list: (categoryId: number) =>
    api.get<Subcategory[]>(`/subcategories?categoryId=${categoryId}`),
}
