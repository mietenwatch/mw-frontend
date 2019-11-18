import React from 'react';

import { plotColorScaleLeistbarkeit } from '../../../styles/variables';
import formatDistricts from '../plot/format-districts';
import Plot from '../plot';

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const traceLabels = rawData[0];

  const traces = [];
  const yLabels = data.map(row => row[0]);
  const yLabelsFormatted = yLabels.map(formatDistricts);

  traces.push({
    orientation: 'h',
    type: 'bar',
    x: data.map(row => row[2]),
    y: yLabelsFormatted,
    hoverinfo: 'x',
    name: traceLabels[2],
    marker: {
      color: plotColorScaleLeistbarkeit[0]
    }
  });

  // Affordable
  traces.push({
    orientation: 'h',
    type: 'bar',
    x: data.map(row => row[1]),
    y: yLabelsFormatted,
    name: traceLabels[1],
    hoverinfo: 'x',
    marker: {
      color: plotColorScaleLeistbarkeit[3]
    }
  });

  return traces;
};

export default props => (
  <Plot
    layout={{
      barmode: 'stack',

      legend: {
        traceorder: 'normal'
      },

      xaxis: {
        title: {
          text: 'Anteil der Wohnungsangebote in %'
        },
        type: 'linear',
        range: [0, 100],
        rangemode: 'tozero'
      },

      yaxis: {
        type: 'category'
      }
    }}
    reducer={reducer}
    {...props}
  />
);
