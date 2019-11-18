import React from 'react';

import { wohnenalswareColors } from '../../../styles/variables';
import Plot from '../plot';

const colors = [wohnenalswareColors.c2, wohnenalswareColors.c3];

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const traceTypes = data.reduce((acc, row) => {
    if (!acc.includes(row[0])) {
      acc.push(row[0]);
    }

    return acc;
  }, []);

  const xLabels = data.reduce((acc, row) => {
    if (!acc.includes(row[1])) {
      acc.push(row[1]);
    }

    return acc;
  }, []);

  return traceTypes.map((name, index) => ({
    name,
    type: 'scatter',
    x: xLabels,
    y: data.map(row => row[0] === name && row[2]).filter(Boolean),
    marker: {
      color: colors[index],
      size: 10
    }
  }));
};

export default props => (
  <Plot
    layout={{
      yaxis: {
        autorange: true,
        showgrid: false,
        title: {
          text: 'Nettokaltmiete in €/m²'
        },
        rangemode: 'tozero'
      },

      xaxis: {
        showgrid: true,
        title: {
          text: 'Baujahr'
        }
      }
    }}
    reducer={reducer}
    {...props}
  />
);
