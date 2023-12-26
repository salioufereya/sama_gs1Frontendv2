export interface Root<T> {
  code: number;
  message: string;
  data: T[];
}
export interface RootLogin<T> {
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
  prenom: string;
  login: string;
  telephone: string;
  email: string;
  role: string;
  ecole: Ecole;
  ecole_id?: number;
  telephone_bureau: string;
  adresse: string;
  civilite: string;
  photo?: string;
}

export interface Ecole {
  id: number;
  libelle: string;
  date_creation: Date;
  type_ecole: string;
  adresse: string;
  logo: string;
  numero_bureau: string;
  numero_personnel: string;
  email: string;
  numero_autorisation: string;
}

export interface Student {
  id: number;
  nom: string;
  prenom: string;
  photo: string;
  photo_diplome?: string;
  ecole?: string;
  telephone_bureau: string;
  departement: string;
  filiere: string;
  niveau: string;
  civilite: string;
  matricule?: string;
  numero_gtin: string;
  date_obtention: string;
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

export interface Filiere {
  id: number;
  libelle: string;
}

export interface Niveau {
  id: number;
  libelle: string;
}
export interface Reset {
  message: string;
  code: number;
}

export interface Civility {
  id: number;
  libelle: string;
}
