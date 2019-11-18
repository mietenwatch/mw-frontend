import React from 'react';

import { plotColorScaleLeistbarkeit } from '../../../styles/variables';
import Plot from '../plot';

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const traceLabels = rawData[0];
  const traces = [];
  const xLabels = data.map(row => row[0]);

  traceLabels
    .slice(1, traceLabels.length)
    .forEach((district, districtIndex) => {
      traces.push({
        name: district,
        type: 'scatter',
        x: xLabels,
        y: data.map(row => row[districtIndex + 1]),
        marker: {
          color:
            districtIndex === 0
              ? plotColorScaleLeistbarkeit[0]
              : plotColorScaleLeistbarkeit[3]
        }
      });
    });

  return traces;
};

export default props => (
  <Plot
    layout={{
      xaxis: {
        type: 'date'
      },

      yaxis: {
        autorange: true,
        title: {
          text: 'Anzahl Angebote pro Woche'
        }
      }
    }}
    reducer={reducer}
    {...props}
  />
);
