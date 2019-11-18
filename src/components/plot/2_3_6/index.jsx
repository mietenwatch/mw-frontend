import React from 'react';

import Plot from '../plot';

export const reducer = rawData => rawData.slice(1, rawData.length);

const addColorScheme = (data, title) => {
  return ['andere Anbieter', title].map(type => {
    const points = data.reduce((acc, row) => {
      if (row[0] === type) {
        acc.push(row[1], row[2]);
      }

      return acc;
    }, []);

    return {
      type: 'pointcloud',
      name: type,
      showLegend: false,
      hoverinfo: 'none',
      marker: {
        sizemin: 30,
        sizemax: 30,
        color:
          type === 'andere Anbieter'
            ? 'rgba(122, 86, 35, .75)'
            : 'rgb(50, 115, 118)'
      },
      xy: new Float32Array(points)
    };
  });
};

export default ({ data, title, ...props }) => (
  <Plot
    data={addColorScheme(data, title)}
    title={title}
    layout={{
      xaxis: {
        title: {
          text: 'Nettokaltmiete in €/m²'
        },
        rangemode: 'tozero'
      },

      yaxis: {
        title: {
          text: 'Nebenkosten in €/m²'
        },
        rangemode: 'tozero'
      },

      showlegend: false
    }}
    {...props}
  />
);
