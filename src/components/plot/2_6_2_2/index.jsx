import React from 'react';

import { wohnenalswareColors } from '../../../styles/variables';
import formatDistricts from '../plot/format-districts';
import Plot from '../plot';

const colors = [wohnenalswareColors.c2, wohnenalswareColors.c3];

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const yLabels = data.map(row => formatDistricts(row[0]));

  return rawData[0].slice(1, rawData[0].length).map((name, index) => ({
    name,
    type: 'bar',
    orientation: 'h',
    x: data.map(row => row[index + 1]),
    y: yLabels,
    marker: {
      color: colors[index]
    }
  }));
};

export default props => (
  <Plot
    layout={{
      barmode: 'stack',

      xaxis: {
        range: [0, 100],
        title: {
          text: 'Anteil der Angebote in %'
        }
      }
    }}
    reducer={reducer}
    {...props}
  />
);
