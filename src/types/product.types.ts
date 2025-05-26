export interface ProductCreateRequest {
  categoryId: string;
  subcategoryId?: string;
  name: string;
  description: string;
  ingredientes: string[];
  alergenos: string[];
  precio: number;
  img: string;
}

export interface ProductUpdateRequest {
  categoryId?: string;
  subcategoryId?: string;
  name?: string;
  description?: string;
  ingredientes?: string[];
  alergenos?: string[];
  precio?: number;
  img?: string;
  isActive?: boolean; // Permitir reactivar productos
}

export interface ProductQuery {
  category?: string;
  subcategory?: string;
  search?: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean; // Para incluir productos inactivos
}
