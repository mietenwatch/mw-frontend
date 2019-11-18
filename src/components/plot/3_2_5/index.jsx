import React from 'react';

import { plotColorScaleLeistbarkeit } from '../../../styles/variables';
import Plot from '../plot';

const colors = [plotColorScaleLeistbarkeit[0], plotColorScaleLeistbarkeit[5]];

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const xLabels = data.map(row => row[0]);

  return rawData[0].slice(1, rawData[0].length).map((name, index) => ({
    name,
    type: 'bar',
    x: xLabels,
    y: data.map(row => row[index + 1]),
    marker: {
      color: colors[index]
    }
  }));
};

export default props => (
  <Plot
    layout={{
      barmode: 'group',
      xaxis: {
        title: {
          text: 'Baujahresklasse'
        }
      },

      yaxis: {
        title: {
          text: 'Kosten in €/m²'
        }
      }
    }}
    reducer={reducer}
    {...props}
  />
);
