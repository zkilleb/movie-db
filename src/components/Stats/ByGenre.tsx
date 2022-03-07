import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { chartColors } from '../../constants';
import { Result } from '../../classes';
import { getAllMovies } from '../../handlers';

export function ByGenre() {
  const classes = useStyles();
  const [compiledGenres, setCompiledGenres] =
    React.useState<AggregatedGenre[]>();

  React.useEffect(() => {
    async function fetchData() {
      const results: Result[] = await getAllMovies();
      const genres = aggregrateData(results);
      setCompiledGenres(genres);
    }
    fetchData();
  }, []);

  return (
    <div>
      <div className={classes.header}>Movies By Genre</div>
      {compiledGenres && (
        <PieChart width={250} height={250}>
          <Tooltip />
          <Pie
            data={compiledGenres}
            dataKey="amount"
            nameKey="genre"
            fill="#8884d8"
          >
            {compiledGenres.map((entry, index) => (
              <Cell
                key={index}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      )}
    </div>
  );

  function aggregrateData(data: Result[]) {
    let genres: AggregatedGenre[] = [];
    let existingGenres: string[] = [];

    data.forEach((result) => {
      if (result.genre) {
        if (existingGenres.includes(result.genre)) {
          const index = genres.findIndex((genre) => {
            return genre.genre === result.genre;
          });
          genres[index].amount++;
        } else {
          existingGenres.push(result.genre);
          genres.push({ genre: result.genre, amount: 1 });
        }
      }
    });
    return genres;
  }
}

interface AggregatedGenre {
  genre: string;
  amount: number;
}

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 25,
  },
}));
