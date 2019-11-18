import React from 'react';

import { plotColorScaleLeistbarkeit } from '../../../styles/variables';
import Plot from '../plot';

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);

  return data.map(([name, value]) => ({
    name,
    type: 'bar',
    orientation: 'h',
    hoverinfo: 'x',
    x: [value],
    y: [name],
    marker: {
      color: plotColorScaleLeistbarkeit[0]
    }
  }));
};

export default props => (
  <Plot
    layout={{
      xaxis: {
        showgrid: true,
        title: {
          text: 'Nettokaltmiete in €/m²'
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
