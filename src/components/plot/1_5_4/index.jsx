import React from 'react';

import { plotColorScaleLeistbarkeit } from '../../../styles/variables';
import Plot from '../plot';

const removeDuplicates = (acc, label) => {
  if (!acc.includes(label)) {
    acc.push(label);
  }

  return acc;
};

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const traces = [];
  const xLabels = data.map(row => row[0]).reduce(removeDuplicates, []);
  const groups = data.map(row => row[2]).reduce(removeDuplicates, []);

  groups.forEach((type, index) => {
    traces.push({
      name: `${type} des S-Bahn-Rings`,
      marker: {
        color:
          index === 1
            ? plotColorScaleLeistbarkeit[0]
            : plotColorScaleLeistbarkeit[3]
      },
      type: 'bar',
      hoverinfo: 'y',
      x: xLabels,
      y: xLabels.reduce((acc, numberOfPersons) => {
        const value = data
          .map(row => row[0] === numberOfPersons && row[2] === type && row[1])
          .filter(Boolean)[0];

        acc.push(value);

        return acc;
      }, [])
    });
  });

  return traces;
};

export default props => (
  <Plot
    layout={{
      bargap: 0.15,
      barmode: 'group',

      xaxis: {
        title: {
          text: 'Personen im Haushalt'
        },
        type: 'linear'
      },

      yaxis: {
        autorange: true,
        rangemode: 'tozero',
        title: {
          text: 'Leistbare Wohnungen in %'
        }
      }
    }}
    reducer={reducer}
    {...props}
  />
);
