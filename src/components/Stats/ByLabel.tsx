import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { chartColors } from '../../constants';
import { ReleaseStat } from '../../classes';
import { getAllReleases } from '../../handlers/getAllReleases';

export function ByLabel() {
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
      <div className={classes.header}>Releases By Label</div>
      {flatReleases && (
        <PieChart width={250} height={250}>
          <Tooltip />
          <Pie
            data={flatReleases}
            dataKey="amount"
            nameKey="label"
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
    let labels: AggregatedRelease[] = [];
    let existingLabels: string[] = [];

    data.forEach((result) => {
      if (result.release.label) {
        if (existingLabels.includes(result.release.label)) {
          const index = labels.findIndex((label) => {
            return label.label === result.release.label;
          });
          labels[index].amount++;
        } else {
          existingLabels.push(result.release.label);
          labels.push({ label: result.release.label, amount: 1 });
        }
      }
    });
    return labels;
  }
}

interface AggregatedRelease {
  label: string;
  amount: number;
}

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 25,
  },
}));
