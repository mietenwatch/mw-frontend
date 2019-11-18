import React from 'react';

import { wohnenalswareColors } from '../../../styles/variables';
import Plot from '../plot';

const colors = [wohnenalswareColors.c2, wohnenalswareColors.c3];

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const traces = data.reduce((acc, [name, value, type]) => {
    if (!acc[type]) {
      acc[type] = {
        orientation: 'h',
        type: 'bar',
        hoverinfo: 'x',
        x: [],
        y: [],
        marker: {
          color: colors[Object.keys(acc).length]
        }
      };
    }

    const { x, y } = acc[type];

    if (!y.includes(name)) {
      y.push(name);
    }

    x.push(value);

    if (!acc[type].name) {
      acc[type].name = type;
    }

    return acc;
  }, {});

  return [traces.privat, traces.städtisch];
};

export default props => (
  <Plot
    layout={{
      xaxis: {
        title: {
          text: 'Anteil aller untersuchten Angebote in %'
        },
        showgrid: true
      },

      yaxis: {
        showgrid: false,
        categoryorder: 'max ascending'
      }
    }}
    reducer={reducer}
    {...props}
  />
);
