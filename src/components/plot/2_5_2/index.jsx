import React from 'react';

import { wohnenalswareColors } from '../../../styles/variables';
import Plot from '../plot';

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const xLabels = data.map(row => row[0]);

  return [
    {
      type: 'waterfall',
      orientation: 'v',
      x: xLabels,
      textposition: 'inside',
      y: data.map(([name, value]) => {
        return name === 'Nettokaltmiete' ? `+${value}` : `-${value}`;
      }),
      text: data.map(([name, value]) => `${name}: ${value} €/m²`),
      decreasing: { marker: { color: wohnenalswareColors.c2 } },
      increasing: { marker: { color: wohnenalswareColors.c2 } }
    }
  ];
};

export default props => (
  <Plot
    layout={{
      xaxis: {
        showticklabels: false
      },

      yaxis: {
        title: {
          text: '€/m²'
        },
        showgrid: false
      },

      autosize: true,
      showlegend: false
    }}
    reducer={reducer}
    {...props}
  />
);
