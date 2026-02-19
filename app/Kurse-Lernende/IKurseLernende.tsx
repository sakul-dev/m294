export interface IKurseLernende {
  id_kurse_lernende?: string; // Optional because new entries won't have an ID yet
  nr_lernende: string;
  nr_kurs: string;
  note: string;
}
