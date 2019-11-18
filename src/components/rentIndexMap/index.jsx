import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import BerlinMap from '../berlin-map';
import MapLegend from '../mapLegend';
import styles from './rentIndexMap.module.scss';
import colorFromScale from '../../utils/colorFromScale';
import { bgColors } from '../../styles/variables';

export default () => {
  const [berlinDistricts, setBerlinDistricts] = useState(null);

  useEffect(() => {
    fetch('/visualization-data/berlin-districts.json')
      .then(res => res.json())
      .then(setBerlinDistricts);
  }, []);

  function districtStyle(feature) {
    const numericValue = parseInt(
      feature.properties.mietspiegel_ueberschreitung_prozent,
      10
    );
    return {
      fillOpacity: 1,
      fillColor:
        numericValue <= 0
          ? colorFromScale(0, 0, 100)
          : colorFromScale(numericValue, 0, 100),
      weight: 0.5,
      color: 'white'
    };
  }

  function districtInfo(district) {
    const percent = district.properties.mietspiegel_ueberschreitung_prozent;
    if (!percent || percent === 'NA') {
      return `<div>${district.properties.Ortsteilna}</div> <i>unsichere Datenlage</i>`;
    }

    return `<div>${district.properties.Ortsteilna}</div>
        <div style='font-size: 1.5rem; font-weight: bold;
          color: ${colorFromScale(parseInt(percent, 0), 0, 100)}'>
          ${percent} %
        </div>
        <div style='font-style: italic;'>
          entspricht ${parseFloat(
            district.properties.mietspiegel_ueberschreitung_euro
          )
            .toFixed(2)
            .toString()
            .replace('.', ',')}&nbsp;€
        </div>
      </>
    `;
  }

  function renderLegend() {
    const valuesWithColors = [100, 80, 60, 40, 20, 0].map(value => {
      return [value, colorFromScale(value, 0, 100, false)];
    });
    return (
      <MapLegend
        valuesWithColors={valuesWithColors}
        header="Durchschnittliche Überschreitung des Mietspiegels"
        appendix="%"
      />
    );
  }

  function districtZoomInfo(district) {
    return (
      <div className={styles.districtZoomInfo}>
        {`Mit ${district.feature.properties.mietspiegel_ueberschreitung_euro}&nbsp;€
        wird der Mietspiegel in ${district.feature.properties.Ortsteilna} durchschnittlich
        um ${district.feature.properties.mietspiegel_ueberschreitung_prozent}&nbsp;% überschritten.`}
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      {berlinDistricts && (
        <BerlinMap
          berlinDistricts={berlinDistricts}
          districtTooltip={districtInfo}
          districtStyle={districtStyle}
          districtZoomInfo={districtZoomInfo}
          keepStyleOnZoom
          bgColor={bgColors.yellow}
          legend={renderLegend()}
        />
      )}
    </div>
  );
};
