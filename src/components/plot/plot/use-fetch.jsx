import Papa from 'papaparse';
import { useState, useEffect } from 'react';

export default (source, reducer) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    Papa.parse(source, {
      download: true,
      complete: results => {
        const { data: rawData } = results;
        const cleanedData = rawData.filter(row => row.length > 1);

        setData(reducer(cleanedData));
      }
    });
  }, [source]);

  return data;
};
