export interface UserCreateRequest {
  username: string;
  password: string;
  role?: 'admin';
}

export interface UserUpdateRequest {
  username?: string;
  password?: string;
  isActive?: boolean;
  role?: 'admin';
}

export interface UserQuery {
  search?: string;
  page?: string | number;
  limit?: string | number;
}
