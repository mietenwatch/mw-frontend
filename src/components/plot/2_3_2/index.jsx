import React from 'react';

import { wohnenalswareColors } from '../../../styles/variables';
import Plot from '../plot';

const colors = [
  wohnenalswareColors.c2,
  wohnenalswareColors.c2_1,
  wohnenalswareColors.c2_2,
  wohnenalswareColors.c2_3
];

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const yLabels = data.map(row => row[0]);

  return rawData[0].slice(1, rawData[0].length).map((name, index) => ({
    name,
    orientation: 'h',
    type: 'bar',
    y: yLabels,
    x: data.map(row => row[index + 1]),
    hoverinfo: ['x', 'y'],
    marker: {
      color: colors[index]
    }
  }));
};

export default props => (
  <Plot
    layout={{
      barmode: 'stack',

      legend: {
        traceorder: 'normal'
      },

      xaxis: {
        range: [0, 100],
        title: {
          text: 'Anteil der Angebote in %'
        },
        rangemode: 'tozero'
      }
    }}
    reducer={reducer}
    {...props}
  />
);
