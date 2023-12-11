export interface Root<T> {
  code: number;
  message: string;
  data: T;
}

export interface Login {
  user: User;
  token: string;
}

export interface User {
  id: number;
  nom: string;
  email: string;
  prenom: string;
  role: string[] | string;
  telephone: string;
  ecole: string;
  photo: string;
}

export interface Class {
  id: number;
  libelle: string;
}

export interface Login {
  code: number;
  message: string;
  data: LoginData;
}

export interface LoginData {
  user: User;
  token: string;
}

export interface Reset {
  message: String;
  code: number;
}
