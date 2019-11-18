import React from 'react';

import { wohnenalswareColors } from '../../../styles/variables';
import formatDistricts from '../plot/format-districts';
import Plot from '../plot';

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const labels = data.reduce(
    (acc, [district, yearRange]) => {
      const { x, y } = acc;

      if (!y.includes(district)) {
        y.push(formatDistricts(district));
      }

      if (!x.includes(yearRange)) {
        x.push(yearRange);
      }

      return acc;
    },
    { x: [], y: [] }
  );

  return [
    {
      ...labels,
      z: labels.y.map(district => {
        return data
          .map(row => {
            if (row[0] === district) {
              const value = row[2];

              if (value === 'NA') {
                return '0';
              }

              return value;
            }

            return null;
          })
          .filter(Boolean);
      }),
      colorscale: [
        ['0', wohnenalswareColors.c1],
        ['0.4', wohnenalswareColors.c2],
        ['1', wohnenalswareColors.c3]
      ],
      hoverinfo: 'z',
      type: 'heatmap'
    }
  ];
};

export default props => (
  <Plot
    layout={{
      xaxis: {
        title: {
          text: 'Baujahr'
        }
      }
    }}
    reducer={reducer}
    {...props}
  />
);
