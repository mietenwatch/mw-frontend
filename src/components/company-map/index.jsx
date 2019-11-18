import React, { useState, useEffect, useRef } from 'react';
import { GeoJSON } from 'react-leaflet';
import { circle } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../utils/setInteractive';
import classNames from 'classnames';
import BerlinMap from '../berlin-map';
import { bgColors } from '../../styles/variables';
import styles from './company-map.module.scss';
import jsonToGeoJson from '../../utils/jsonToGeoJson';

export default () => {
  const apartmentsRef = useRef(null);

  const emptyFeatureCollection = { type: 'FeatureCollection', features: [] };
  const [berlinDistricts, setBerlinDistricts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apartments, setApartments] = useState(emptyFeatureCollection);
  const [company, setCompany] = useState('Deutsche Wohnen');

  function fetchApartments() {
    fetch(`https://mwapi.mietenwatch.de/estates/${company}`)
      .then(response => response.json())
      .then(data => {
        setLoading(currLoading => {
          /* currLoading is the true loading state of the component,
          not that of the closure that getApartment() was called.
          See https://reactjs.org/docs/hooks-reference.html#functional-updates */
          if (currLoading && typeof data.resData !== 'undefined') {
            setApartments(jsonToGeoJson(data.resData));
          }
          // Update the loading state to false
          return false;
        });
      })
      .catch(error => {
        setLoading(false);

        // eslint-disable-next-line no-console
        console.error(error);
      });
  }

  useEffect(() => {
    fetch('/visualization-data/berlin-districts.json')
      .then(res => res.json())
      .then(setBerlinDistricts);
  }, []);

  useEffect(() => {
    fetchApartments();
  }, [company, berlinDistricts]);

  function handleCompanyClick(c) {
    setLoading(true);
    setCompany(c);
  }

  function districtStyle() {
    return {
      fillColor: bgColors.yellow,
      fillOpacity: 1,
      weight: 0.3,
      color: 'black'
    };
  }

  function apartmentInfo(feature) {
    const props = feature.properties;
    const totalCostsSqm =
      Math.round((props.cst_totalCosts / props.obj_flatSize) * 100) / 100;
    return `<div>
      <b style='font-size: 1.5rem;'>${Math.round(props.cst_totalCosts)} €</b>
      <div style='border-bottom: 1px solid black; margin: 0.5rem 0;'></div>
      <div style='text-transform:uppercase; font-size:0.5rem;font-weight:700; margin-bottom: -0.3rem'>Zimmer</div>
      <b style='font-size:1rem'>${props.obj_rooms}</b>
      <br>
      <div style='text-transform:uppercase; font-size:0.5rem;font-weight:700; margin-bottom: -0.3rem'>Wohnfläche</div>
      <b style='font-size:1rem'>${Math.round(props.obj_flatSize)} m²</b>
      <br>
      <div style='text-transform:uppercase; font-size:0.5rem;font-weight:700; margin-bottom: -0.3rem'>Warmmiete</div>
      <b style='font-size:1rem'>
        ${totalCostsSqm
          .toFixed(2)
          .toString()
          .replace('.', ',')} <sup>€</sup>&frasl;<sub>m²</sub></b>
    </div>`;
  }

  function onEachApartment(feature, layer) {
    layer.bindTooltip(apartmentInfo(feature), {
      closeButton: false,
      direction: 'right'
    });
  }

  function onDistrictZoomIn() {
    apartmentsRef.current.leafletElement.setInteractive(true);
  }

  function onDistrictZoomOut() {
    apartmentsRef.current.leafletElement.setInteractive(false);
  }

  function renderCompanyButtons() {
    const companies = [
      'Ado Immobilien',
      'Akelius',
      'Degewo',
      'Deutsche Wohnen',
      'Gesobau',
      'Gewobag',
      'Howoge',
      'Immonexxt',
      'Stadt und Land',
      'Vonovia'
    ];
    return companies.map(c => {
      const classes = classNames(styles.companyButton, {
        [styles.active]: company === c
      });
      return (
        <div
          className={classes}
          onClick={() => handleCompanyClick(c)}
          onKeyPress={() => handleCompanyClick(c)}
          key={c}
          role="button"
          tabIndex="0"
        >
          {c}
        </div>
      );
    });
  }

  function districtInfo(district) {
    return `<div style='font-weight: bold'>
      ${district.properties.Ortsteilna}
    </div>`;
  }

  function districtZoomInfo(district) {
    return (
      <h3 className="mapConclusion">
        {district.feature.properties.Ortsteilna}
      </h3>
    );
  }

  return berlinDistricts && apartments.features.length > 0 ? (
    <div className={styles.mapContainer}>
      <div className={styles.buttonContainer}>{renderCompanyButtons()}</div>
      <BerlinMap
        berlinDistricts={berlinDistricts}
        districtStyle={districtStyle}
        districtTooltip={districtInfo}
        onDistrictZoomIn={onDistrictZoomIn}
        onDistrictZoomOut={onDistrictZoomOut}
        districtZoomInfo={districtZoomInfo}
        loading={loading}
        bgColor={bgColors.yellow}
      >
        <GeoJSON
          key={apartments.features.length}
          ref={apartmentsRef}
          data={apartments}
          onEachFeature={onEachApartment}
          pointToLayer={(feature, latlng) =>
            circle(latlng, {
              interactive: false,
              radius: 20,
              weight: 0,
              fillOpacity: 1,
              color: 'rgb(200, 113, 150)'
            })
          }
        />
      </BerlinMap>
    </div>
  ) : (
    <div className={styles.mapContainer}>Lade Karte...</div>
  );
};
