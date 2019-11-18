import React from 'react';

import { plotColorScaleLeistbarkeit } from '../../../styles/variables';
import formatDistricts from '../plot/format-districts';
import Plot from '../plot';

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);

  const traces = [];
  const yLabels = data.map(row => row[0]);
  const yLabelsFormatted = yLabels.map(formatDistricts);
  const traceLabels = rawData[0];
  const rowLength = rawData[0].length;

  for (
    let numberOfPersons = 1;
    numberOfPersons < rowLength;
    // eslint-disable-next-line no-plusplus
    ++numberOfPersons
  ) {
    yLabels.forEach(label => {
      // Find a trace, with the same number of persons
      const existingTrace = traces.find(
        ({ meta: { numberOfPersons: traceNumberOfPersons } }) =>
          traceNumberOfPersons === numberOfPersons
      );
      const x = data.find(row => row[0] === label)[numberOfPersons];

      // if a trace for the current number of people already exists,
      // extend the trace. Otherwise create a new one.
      if (existingTrace) {
        existingTrace.x.push(x);
      } else {
        traces.push({
          // the meta field is used to identify the different groups of traces
          // by the number of persons
          meta: { numberOfPersons },
          mode: 'markers',
          name: traceLabels[numberOfPersons],
          type: 'scatter',
          hoveron: 'points',
          hoverinfo: 'x',
          visible: numberOfPersons <= 4 ? true : 'legendonly',
          marker: {
            color: plotColorScaleLeistbarkeit[numberOfPersons - 1],
            size: 14
          },
          x: [x],
          y: yLabelsFormatted
        });
      }
    });
  }

  return traces;
};

export default props => (
  <Plot
    layout={{
      xaxis: {
        title: {
          text: 'Leistbare Wohnfläche in m²'
        },
        type: 'linear',
        showgrid: false,
        autorange: true,
        rangemode: 'tozero'
      },

      yaxis: {
        type: 'category',
        autorange: true
      }
    }}
    reducer={reducer}
    {...props}
  />
);
