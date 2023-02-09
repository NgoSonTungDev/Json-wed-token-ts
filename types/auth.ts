export interface IAuth {
  _id?: string;
  username: string;
  password: string;
  isAdmin: string;
  refreshToken: string;
  createdAt?: string;
  updatedAt?: string;
}
