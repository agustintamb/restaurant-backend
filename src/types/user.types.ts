export interface UserCreateRequest {
  username: string;
  password: string;
  role?: 'admin';
}

export interface UserUpdateRequest {
  username?: string;
  password?: string;
}

export interface UserQuery {
  search?: string;
  page?: number;
  limit?: number;
}
