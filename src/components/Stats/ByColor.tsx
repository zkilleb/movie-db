import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { chartColors } from '../../constants';
import { Result } from '../../classes';
import { getAllMovies } from '../../handlers';
import { statHeaderStyle } from '../../styles';

export function ByColor() {
  const classes = useStyles();
  const [compiledColors, setCompiledColors] =
    React.useState<AggregatedColor[]>();

  React.useEffect(() => {
    async function fetchData() {
      const results: Result[] = await getAllMovies();
      const colors = aggregrateData(results);
      setCompiledColors(colors);
    }
    fetchData();
  }, []);

  return (
    <div>
      <div className={classes.statHeaderStyle}>Movies By Color</div>
      {compiledColors && (
        <PieChart width={250} height={250}>
          <Tooltip />
          <Pie
            data={compiledColors}
            dataKey="amount"
            nameKey="color"
            fill="#8884d8"
          >
            {compiledColors.map((entry, index) => (
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
    let colors: AggregatedColor[] = [
      { color: 'Color', amount: 0 },
      { color: 'B/W', amount: 0 },
    ];

    data.forEach((result) => {
      if (result.color) colors[0].amount++;
      else colors[1].amount++;
    });
    return colors;
  }
}

interface AggregatedColor {
  color: string;
  amount: number;
}

const useStyles = makeStyles(() => ({
  statHeaderStyle,
}));
