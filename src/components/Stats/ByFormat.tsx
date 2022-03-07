import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { chartColors } from '../../constants';
import { ReleaseStat } from '../../classes';
import { getAllReleases } from '../../handlers';

export function ByFormat() {
  const classes = useStyles();
  const [flatReleases, setFlatReleases] = React.useState<AggregatedRelease[]>();

  React.useEffect(() => {
    async function fetchData() {
      const results: ReleaseStat[] = await getAllReleases();
      const labels = aggregrateData(results);
      setFlatReleases(labels);
    }
    fetchData();
  }, []);

  return (
    <div>
      <div className={classes.header}>Releases By Format</div>
      {flatReleases && (
        <PieChart width={250} height={250}>
          <Tooltip />
          <Pie
            data={flatReleases}
            dataKey="amount"
            nameKey="format"
            fill="#8884d8"
          >
            {flatReleases.map((entry, index) => (
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

  function aggregrateData(data: ReleaseStat[]) {
    let formats: AggregatedRelease[] = [];
    let existingFormats: string[] = [];

    data.forEach((result) => {
      if (existingFormats.includes(result.release.format)) {
        const index = formats.findIndex((format) => {
          return format.format === result.release.format;
        });
        formats[index].amount++;
      } else {
        existingFormats.push(result.release.format);
        formats.push({ format: result.release.format, amount: 1 });
      }
    });
    return formats;
  }
}

interface AggregatedRelease {
  format: string;
  amount: number;
}

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 25,
  },
}));
