export interface IDashboardStats {
  // Contadores simples por entidad
  dishes: {
    total: number;
    active: number;
    deleted: number;
  };
  categories: {
    total: number;
    active: number;
    deleted: number;
  };
  subcategories: {
    total: number;
    active: number;
    deleted: number;
  };
  ingredients: {
    total: number;
    active: number;
    deleted: number;
  };
  allergens: {
    total: number;
    active: number;
    deleted: number;
  };
  users: {
    total: number;
    active: number;
    deleted: number;
  };
}

export interface ICategoryStats {
  _id: string;
  name: string;
  dishCount: number;
}

export interface IPriceStats {
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  totalValue: number; // suma de todos los precios
}

export interface IDashboardStatsResponse {
  message: string;
  result: IDashboardStats;
}
