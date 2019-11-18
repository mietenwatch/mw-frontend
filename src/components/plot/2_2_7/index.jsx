import React from 'react';

import Plot from '../plot';

const reducer = rawData => {
  const data = rawData.slice(1, rawData.length);
  const showByDefault = ['Deutsche Wohnen', 'Akelius'];

  return data.map(row => ({
    visible: showByDefault.includes(row[0]) ? true : 'legendonly',
    name: row[0],
    histfunc: 'sum',
    type: 'histogram',
    y: row.slice(1, row.length),
    x: rawData[0].slice(1, rawData[0].length),
    opacity: 0.5
  }));
};

export default props => (
  <Plot
    layout={{
      bargap: 0,
      barmode: 'overlay',

      xaxis: {
        title: {
          text: 'Baujahrsklassen'
        },
        tickangle: 30,
        range: [
          '1880-1890',
          '1890-1900',
          '1900-1910',
          '1910-1920',
          '1920-1930',
          '1930-1940',
          '1940-1950',
          '1950-1960',
          '1960-1970',
          '1970-1980',
          '1980-1990',
          '1990-2000',
          '2000-2010',
          '2010-2019'
        ]
      },

      yaxis: {
        title: {
          text: 'Anteil der Wohnungsangebote in %'
        },
        range: [0, 40]
      }
    }}
    reducer={reducer}
    {...props}
  />
);
