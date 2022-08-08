import { getTMDBKeyword } from '../handlers';
import { TMDBResult } from '../classes';

export async function filterTMDBResult(
  year: string,
  title: string,
): Promise<TMDBResult | undefined> {
  const minYear = parseInt(year) - 1;
  const maxYear = parseInt(year) + 1;
  const tmdbResults = await getTMDBKeyword(title, 'title');
  if (tmdbResults) {
    const result: TMDBResult[] | undefined = tmdbResults.find(
      (movie: TMDBResult) =>
        title &&
        movie.title.toLowerCase() === title.toLowerCase() &&
        parseInt(movie.release_date.substring(0, 4)) >= minYear &&
        parseInt(movie.release_date.substring(0, 4)) <= maxYear,
    );
    return result;
  }
  return;
}

export function getFormattedDate() {
  const currentDate = new Date();
  const formattedDate = `${
    currentDate.getMonth() + 1
  }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
  return formattedDate;
}
