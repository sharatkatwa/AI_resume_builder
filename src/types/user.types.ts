export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JWTPayload {
  id: string;
  name?: string;
  email?: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  phone?: number;
}

export interface LoginBody {
  email: string;
  password: string;
}
