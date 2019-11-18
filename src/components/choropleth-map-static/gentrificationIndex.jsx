import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import classNames from 'classnames';
import BerlinMap from '../berlin-map';
import MapLegend from '../mapLegend';
import styles from './choropleth-map-static.module.scss';
import colorFromScale from '../../utils/colorFromScale';
import { bgColors } from '../../styles/variables';

export default () => {
  const attributes = {
    Verdrängungsdruck: {
      name: 'Verdrängungsdruck',
      sign: '='
    },
    Mietenhöhe: {
      name: 'Miethöhe',
      sign: '&'
    },
    Prekarität: {
      name: 'Prekarität',
      sign: ''
    }
  };

  const valueLabels = {
    4: 'sehr hoch',
    3: 'hoch',
    2: 'mittel',
    1: 'unterdurchschnittlich'
  };

  const [activeAttribute, setActiveAttribute] = useState('Verdrängungsdruck');
  const [berlinLOR, setBerlinLOR] = useState(null);

  useEffect(() => {
    fetch('/visualization-data/berlin-lor.json')
      .then(res => res.json())
      .then(setBerlinLOR);
  }, []);

  function handleAttributeClick(attribute) {
    setActiveAttribute(attribute);
  }

  function numericFromOrdinal(feature, attribute) {
    const value = feature.properties[attribute];
    const key = Object.keys(valueLabels).find(k => valueLabels[k] === value);
    return parseInt(key, 10);
  }

  function districtStyle(feature) {
    if (!activeAttribute) return {};
    const numericValue =
      numericFromOrdinal(feature, activeAttribute) ||
      feature.properties[activeAttribute];
    return {
      fillColor: colorFromScale(numericValue, 1, 4),
      fillOpacity: 1,
      weight: 0.5,
      color: 'white'
    };
  }

  function districtInfo(district) {
    if (!district.properties[activeAttribute]) return '';
    const value = district.properties[activeAttribute];

    return `<div style='font-weight: bold;'>
        ${district.properties.Planungsraum}
      </div>
        <div style='font-style: italic;'>${value}</div>
      </>`;
  }

  function districtZoomInfo(district) {
    return (
      <h3 className="mapConclusion">
        {attributes[activeAttribute].name}
        {' in '}
        {district.feature.properties.Planungsraum}
        {': '}
        <strong>{district.feature.properties[activeAttribute]}</strong>
      </h3>
    );
  }

  function renderAttributeButtons() {
    return Object.keys(attributes).map(attribute => {
      const classes = classNames(styles.attributeButton, {
        [styles.active]: activeAttribute === attribute
      });
      return (
        <div key={attribute} className={styles.attributeButtonContainer}>
          <div
            className={classes}
            onClick={() => handleAttributeClick(attribute)}
            onKeyPress={() => handleAttributeClick(attribute)}
            key={attribute}
            role="button"
            tabIndex="0"
          >
            {attributes[attribute].name}
          </div>
          <div className={styles.sign}>{attributes[attribute].sign}</div>
        </div>
      );
    });
  }

  function renderLegend() {
    const { name, appendix } = attributes[activeAttribute];
    const valuesWithColors = [4, 3, 2, 1].map(value => {
      return [valueLabels[value], colorFromScale(value, 1, 4, false)];
    });
    return (
      <MapLegend
        valuesWithColors={valuesWithColors}
        header={name}
        bgColor={bgColors.pink}
        appendix={appendix}
      />
    );
  }

  return (
    <div className={styles.mapContainer}>
      <div className={styles.buttonsWrapper}>{renderAttributeButtons()}</div>

      {berlinLOR && (
        <BerlinMap
          berlinDistricts={berlinLOR}
          backgroundColor={bgColors.pink}
          districtLayerKey={activeAttribute}
          districtTooltip={districtInfo}
          districtZoomInfo={districtZoomInfo}
          keepTooltipOnZoom
          keepStyleOnZoom
          districtStyle={districtStyle}
          bgColor={bgColors.pink}
          legend={renderLegend()}
        />
      )}
    </div>
  );
};
