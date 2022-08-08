import { Release } from '.';
export class Result {
  actors?: string[];
  color: boolean = true;
  director: string = '';
  label?: string;
  language?: string;
  length?: number;
  notes?: string;
  studio?: string;
  title: string = '';
  year: number = 0;
  _id: string = '0000';
  releases: Release[] = [];
  review?: any;
  genre?: string;
}
