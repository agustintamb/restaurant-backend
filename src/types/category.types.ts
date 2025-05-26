export interface CategoryCreateRequest {
  name: string;
  subcategories?: Array<{ name: string }>;
}

export interface CategoryUpdateRequest {
  name?: string;
  subcategories?: Array<{ name: string }>;
  isActive?: boolean;
}

export interface CategoryQuery {
  search?: string;
  includeInactive?: boolean;
}
