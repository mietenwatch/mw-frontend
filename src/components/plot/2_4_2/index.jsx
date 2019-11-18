import React from 'react';

import { wohnenalswareColors } from '../../../styles/variables';
import Plot from '../plot';

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);

  return data.reverse().map(([title, value]) => ({
    marker: {
      color: wohnenalswareColors.c2
    },
    hoverinfo: 'none',
    name: title,
    orientation: 'h',
    type: 'bar',
    x: [value],
    y: [`${title}  `]
  }));
};

export default props => (
  <Plot
    layout={{
      xaxis: {
        showticklabels: false,
        showgrid: true,
        title: {
          text: 'Wichtigkeit zur Erklärung der Nettokaltmiete pro m²'
        }
      },

      yaxis: {
        showgrid: false
      },

      showlegend: false
    }}
    reducer={reducer}
    {...props}
  />
);
