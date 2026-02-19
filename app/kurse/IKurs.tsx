export interface IKurs {
  id_kurs?: string; // Optional because new entries won't have an ID yet
  kursNummer: string;
  kursThema: string;
  kursInhalt: string;
  nr_dozent: string;
  startdatum: string;
  enddatum: string;
  dauer_in_tagen: string;
}
