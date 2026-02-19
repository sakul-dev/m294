export interface IDozent {
  id_dozent?: string; // Optional because new entries won't have an ID yet
  vorname: string;
  nachname: string;
  strasse: string;
  platz: string;
  ort: string;
  nr_country: string;
  gender: string;
  telefon: string;
  email: string;
  birthdate: string;
}
