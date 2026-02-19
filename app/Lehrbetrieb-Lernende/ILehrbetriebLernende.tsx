export interface ILehrbetriebLernende {
  id_lehrbetrieb_lernende?: string; // Optional because new entries won't have an ID yet
  nr_lehrbetrieb: string;
  nr_lernende: string;
  lehrstart: string;
  lehrende: string;
  beruf: string;
}
