export interface Succursale {
  id: number;
  pseudo: string;
}

export interface Root<T> {
  code: number;
  message: string;
  data: T[];
}

export interface Identifiant {
  succursale_id: number;
  telephone: string;
  password: string;
}

export interface LoginData {
  user: User;
  token: string;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  login: string;
  telephone: string;
  email: string;
  role: string;
  ecole: string
}
