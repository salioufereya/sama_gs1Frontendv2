export interface Root<T> {
  code: number;
  message: string;
  data?: T;
}

export interface Login {
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
  ecole: string;
  telephone_bureau: string;
  adresse: string;
  civilite: string;
  photo: string;
}

export interface Class {
  id: number;
  libelle: string;
}
export interface Identifiant {
  succursale_id: number;
  telephone: string;
  password: string;
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
