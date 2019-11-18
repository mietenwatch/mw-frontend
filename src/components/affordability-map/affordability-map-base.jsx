import React, { useState, useEffect, useRef } from 'react';
import { GeoJSON } from 'react-leaflet';
import { circleMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import classNames from 'classnames';
import ToolTip from 'react-tooltip';
import styles from './affordability.module.scss';
import BerlinMap from '../berlin-map';
import colorFromScale from '../../utils/colorFromScale';
import jsonToGeoJson from '../../utils/jsonToGeoJson';
import ApartmentIcon from '../../images/icons/apartment';
import PeopleIcon from '../../images/icons/people';
import MapLegend from '../mapLegend';
import CoinIcon from '../../images/icons/coin';

export default ({
  apiRoute,
  altApiRoute,
  initialFilterParams,
  filters,
  roomsToIncome,
  bgColor
}) => {
  // colors according to colorFromScale function:
  const AFFORDABLE_COLOR = `rgb(${195},${195},${230})`;
  const NON_AFFORDABLE_COLOR = `rgb(${226},${45},${79})`;
  // const INITIAL_SUBTITLE =
  // 'Klicke auf einen Stadtteil, um Mietangebote zu sehen!';
  const INITIAL_SUBTITLE = '';

  const timer = useRef(null);

  const emptyFeatureCollection = { type: 'FeatureCollection', features: [] };

  const [berlinDistricts, setBerlinDistricts] = useState(null);
  const [districtUpdate, setDistrictUpdate] = useState(null);
  const [apartmentUpdate, setApartmentUpdate] = useState(Date.now());
  const [lorData, setLorData] = useState(null);
  const [berlinData, setBerlinData] = useState(null);
  const [apartments, setApartments] = useState(emptyFeatureCollection);
  const [loading, setLoading] = useState(true);
  const [activeApiRoute, setActiveApiRoute] = useState(apiRoute);
  const [filterParams, setFilterParams] = useState(initialFilterParams);
  const [sliderActivated, setSliderActivated] = useState(false);
  const [zoomedIn, setZoomedIn] = useState(false);

  function geoJsonWithLORData(geoJson, json) {
    const features = geoJson.features.map(otGeom => {
      const otData = json.filter(_otData => {
        return otGeom.properties.Ortsteilna === _otData.ot_name;
      })[0];

      if (otData) {
        otGeom.properties.lor_name = otData.ot_name;
        otGeom.properties.lor_affordableFlats = otData.ot_affordableFlats;
        otGeom.properties.lor_totalFlats = otData.ot_totalFlats;
        otGeom.properties.lor_soaf = otData.ot_soaf;
      }

      return otGeom;
    });

    return { type: 'FeatureCollection', features };
  }

  function getApartments(bbox) {
    const bboxString = `${bbox._southWest.lat},${bbox._southWest.lng},${bbox._northEast.lat},${bbox._northEast.lng}`; // eslint-disable-line no-underscore-dangle
    fetch(
      `https://mwapi.mietenwatch.de/${activeApiRoute}/bbox/${bboxString}/${
        filterParams.income
      }/${filterParams.rooms}${
        // eslint-disable-next-line no-nested-ternary
        activeApiRoute === 'affordability'
          ? filterParams.includeSubsidizedHousing === false ||
            !filterParams.includeSubsidizedHousing
            ? '/excludeSocialHousing'
            : '/includeSocialHousing'
          : ''
      }`
    )
      .then(response => response.json())
      .then(data => {
        setLoading(currLoading => {
          /* currLoading is the true loading state of the component,
          not that of the closure that getApartment() was called.
          See https://reactjs.org/docs/hooks-reference.html#functional-updates */
          if (currLoading && typeof data.resData !== 'undefined')
            setApartments(jsonToGeoJson(data.resData));
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

  function getOTdata() {
    fetch(
      `https://mwapi.mietenwatch.de/${activeApiRoute}/berlin/${
        filterParams.income
      }/${filterParams.rooms}/${
        // eslint-disable-next-line no-nested-ternary
        filterParams.includeSubsidizedHousing === false
          ? 'excludeSocialHousing'
          : activeApiRoute === 'affordability'
          ? 'includeSocialHousing'
          : ''
      }`
    )
      .then(response => response.json())
      .then(data => {
        setLorData(data.resData);
        setBerlinData(data.berlinData[0]);
      })
      // eslint-disable-next-line no-console
      .catch(error => console.error(error));
  }

  /* eslint-disable no-use-before-define */
  useEffect(() => {
    if (!lorData) return;
    setDistrictUpdate(Date.now());
    setLoading(false);
  }, [lorData]);

  useEffect(() => {
    setApartmentUpdate(Date.now());
  }, [apartments]);

  useEffect(() => {
    getOTdata();
  }, [activeApiRoute]);

  useEffect(() => {
    if (sliderActivated) {
      timer.current = setTimeout(() => {
        getOTdata();
      }, 500);
    }
    return () => clearTimeout(timer.current);
  }, [filterParams]);
  /* eslint-enable no-use-before-define */

  function style(feature) {
    const props = feature.properties;
    return {
      weight: 0,
      fillOpacity: 1,
      radius: 3,
      color: props.cst_affordable ? AFFORDABLE_COLOR : NON_AFFORDABLE_COLOR
    };
  }

  function districtInfo(feature) {
    const props = feature.properties;
    if (typeof props.lor_soaf === 'undefined') {
      return `<div>${props.Ortsteilna}</div> <i>unsichere Datenlage</i>`;
    }

    const percentoaf = (props.lor_soaf * 100).toFixed(0);
    return `<div>${props.Ortsteilna}</div>
        <div style='font-size: 1.5rem; font-weight: bold;
          color: ${colorFromScale(props.lor_soaf, 0, 1, true)}'>
          ${percentoaf}&nbsp;%
        </div>
        <div style='font-style: italic;'>
          ${props.lor_affordableFlats} von
          ${props.lor_totalFlats}
        </div>
        <div>${
          apiRoute === 'affordabilityH4'
            ? 'der Wohnungen werden<br>vom Jobcenter bezahlt'
            : 'leistbare Angebote'
        }</div>
      </>
    `;
  }

  function districtZoomInfo(district) {
    const percent = (district.feature.properties.lor_soaf * 100).toFixed(0);
    return (
      <div className={styles.districtZoomInfo}>
        {['affordability', 'affordabilityWoRL', 'affordabilityWRL'].includes(
          apiRoute
        ) && (
          <h3 className="mapConclusion">
            Du kannst dir {percent}&nbsp;% (
            {district.feature.properties.lor_affordableFlats} {' von '}
            {district.feature.properties.lor_totalFlats}) der Angebote in{' '}
            {district.feature.properties.Ortsteilna} leisten.
          </h3>
        )}
        {apiRoute === 'affordabilityAVG' && (
          <h3 className="mapConclusion">
            Ein {filterParams.rooms}-Personen-Haushalt mit
            Durchschnittseinkommen kann sich {percent}&nbsp;% (
            {district.feature.properties.lor_affordableFlats} {' von '}
            {district.feature.properties.lor_totalFlats}) der Angebote in{' '}
            {district.feature.properties.Ortsteilna} leisten.
          </h3>
        )}
        {apiRoute === 'affordabilityH4' && (
          <h3 className="mapConclusion">
            In {district.feature.properties.Ortsteilna} würde das Jobcenter für{' '}
            {percent}&nbsp;% ({district.feature.properties.lor_affordableFlats}
            {' von '}
            {district.feature.properties.lor_totalFlats}) der Angebote die Miete
            übernehmen.
          </h3>
        )}
      </div>
    );
  }

  function berlinInfo() {
    return (
      berlinData && (
        <div className={styles.districtZoomInfo}>
          {['affordability', 'affordabilityWoRL', 'affordabilityWRL'].includes(
            apiRoute
          ) && (
            <h3 className="mapConclusion">
              Du kannst dir {Math.round(berlinData.berlin_soaf * 100)}&nbsp;% (
              {berlinData.berlin_affordableFlats} von{' '}
              {berlinData.berlin_totalFlats}) der Angebote in Berlin leisten.
            </h3>
          )}
          {apiRoute === 'affordabilityAVG' && (
            <h3 className="mapConclusion">
              Ein {filterParams.rooms}-Personen-Haushalt mit
              Durchschnittseinkommen kann sich{' '}
              {Math.round(berlinData.berlin_soaf * 100)}&nbsp;% (
              {berlinData.berlin_affordableFlats} von{' '}
              {berlinData.berlin_totalFlats}) der Angebote in Berlin leisten.
            </h3>
          )}
          {apiRoute === 'affordabilityH4' && (
            <h3 className="mapConclusion">
              In Berlin würde das Jobcenter für{' '}
              {Math.round(berlinData.berlin_soaf * 100)}&nbsp;% (
              {berlinData.berlin_affordableFlats} von{' '}
              {berlinData.berlin_totalFlats}) der Angebote die Miete übernehmen.
            </h3>
          )}
        </div>
      )
    );
  }

  function districtStyle(feature) {
    const fillColor = colorFromScale(feature.properties.lor_soaf, 0, 1, true);
    return {
      fillColor,
      fillOpacity: 1,
      weight: 0.5,
      color: 'white'
    };
  }

  function renderLegend() {
    const values = [100, 80, 60, 40, 20, 0];
    const valuesWithColors = values.map(value => {
      return [value, colorFromScale(value, 0, 100, true)];
    });
    return (
      <MapLegend
        valuesWithColors={valuesWithColors}
        bgColor={bgColor}
        header={
          apiRoute === 'affordabilityH4'
            ? 'Anteil Wohnungen, für die Jobcenter Mietkosten übernimmt'
            : 'leistbare Wohnungen'
        }
        appendix="%"
      />
    );
  }

  function apartmentInfo(feature) {
    const props = feature.properties;
    const color = props.cst_affordable
      ? AFFORDABLE_COLOR
      : NON_AFFORDABLE_COLOR;
    const affordable = props.cst_affordable ? 'leistbar' : 'nicht leistbar';
    const flatSize = Math.round(props.obj_flatSize);
    const totalCostsSqm =
      Math.round((props.cst_totalCosts / props.obj_flatSize) * 100) / 100;
    return `<div>
    <div style='text-transform:uppercase; font-size:0.5rem;font-weight:700; margin-bottom: -0.3rem'>Gesamtmiete</div>
      <b style='font-size: 1.5rem; color: ${color}; margin-top:0'>${Math.round(
      props.cst_totalCosts
    )} €</b>

      <br><b style='color: ${color}'>${affordable}</b>
      <div style='border-bottom: 1px solid black; margin: 0.5rem 0;'></div>
      <div style='text-transform:uppercase; font-size:0.5rem;font-weight:700; margin-bottom: -0.3rem'>Zimmer</div>
      <b style='font-size:1rem; margin-top:0'>${props.obj_rooms}</b>
      <div style='text-transform:uppercase; font-size:0.5rem;font-weight:700; margin-bottom: -0.3rem'>Wohnfläche</div>
      <b style='font-size:1rem'>${flatSize.toString().replace('.', ',')} m²</b>
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

    layer.on({
      mouseover: () => {
        layer.openTooltip();
      }
    });
  }

  function handleSliderChange(attr, value) {
    setSliderActivated(true);
    clearTimeout(timer.current);
    setLoading(true);

    if (roomsToIncome && attr === 'rooms') {
      const income = roomsToIncome[value - 1];
      setFilterParams({ ...filterParams, rooms: value, income });
    } else {
      setFilterParams({ ...filterParams, [attr]: value });
    }
  }

  function onDistrictZoomIn(bbox) {
    setZoomedIn(true);
    setLoading(true);
    getApartments(bbox);
  }

  function onDistrictZoomOut() {
    setZoomedIn(false);
    setLoading(false);
    setApartments(emptyFeatureCollection);
  }

  function renderRLButton() {
    return [altApiRoute, apiRoute].map(route => {
      const classes = classNames(styles.rlButton, {
        [styles.active]: activeApiRoute === route
      });
      return (
        <div
          className={classes}
          onClick={() => setActiveApiRoute(route)}
          onKeyPress={() => setActiveApiRoute(route)}
          role="button"
          tabIndex="0"
        >
          {route === altApiRoute ? 'ohne Mietendeckel' : 'mit Mietendeckel'}
        </div>
      );
    });
  }

  const MapSliderLabel = ({ iconName, children }) => {
    const icons = {
      coin: CoinIcon,
      people: PeopleIcon,
      apartment: ApartmentIcon
    };
    const IconComponent = icons[iconName];
    return (
      <>
        <IconComponent width="24" style={{ marginRight: '0.7rem' }} />
        <span>{children}</span>
      </>
    );
  };

  function renderFilterSlider(params) {
    const [attr, min, max, step] = params;
    /* eslint-disable no-nested-ternary */
    if (attr !== 'includeSubsidizedHousing') {
      return (
        <div key={attr} className={styles.sliderLabel}>
          {['affordability', 'affordabilityWoRL', 'affordabilityWRL'].includes(
            apiRoute
          ) &&
            attr === 'income' && (
              <MapSliderLabel iconName="coin">
                <em className={bgColor === '#ffffff' && styles.currentColor}>
                  {filterParams[attr]} €
                </em>
                &nbsp;
                <p className="tooltip" data-tip data-for="setIncome">
                  Einkommen
                </p>
                <ToolTip id="setIncome">
                  <span>
                    Stelle hier das monatliche Nettoeinkommen deines Haushalts
                    ein. Das Nettoeinkommen ist das Einkommen nach Abzug aller
                    Steuern und Abgaben.
                  </span>
                </ToolTip>
              </MapSliderLabel>
            )}
          {apiRoute === 'affordabilityAVG' && (
            <MapSliderLabel iconName="people">
              <em className={bgColor === '#ffffff' && styles.currentColor}>
                {filterParams[attr]}&nbsp;
              </em>
              <p className="tooltip" data-tip data-for="setPersons">
                {filterParams[attr] === 1 ? (
                  <>Person</>
                ) : filterParams[attr] === 5 ? (
                  <>und mehr Personen</>
                ) : (
                  <>Personen</>
                )}{' '}
                (mit Durchschnittseinkommen)
              </p>
              <ToolTip id="setPersons">
                <span>
                  Für die Bestimmung von angemessenen Wohnungsgrößen in
                  Abhängigkeit der Personenzahl wurde folgende Aufschlüsselung
                  genutzt:
                  <ul>
                    <li>1 Person: 1 bis einschließlich 2 Zimmer</li>
                    <li>2 Personen: 2 bis einschließlich 3 Zimmer </li>
                    <li>3 Personen: 3 bis einschließlich 4 Zimmer </li>
                    <li>4 Personen: 4 bis einschließlich 5 Zimmer </li>
                    <li>5 und mehr Personen: ab 5 Zimmer</li>
                  </ul>
                </span>
              </ToolTip>
            </MapSliderLabel>
          )}
          {['affordability', 'affordabilityWoRL', 'affordabilityWRL'].includes(
            apiRoute
          ) &&
            attr === 'rooms' && (
              <MapSliderLabel iconName="apartment">
                <em className={bgColor === '#ffffff' && styles.currentColor}>
                  {filterParams[attr]}&nbsp;
                </em>
                <p className="tooltip" data-tip data-for="setRooms">
                  Zimmer
                </p>
                <ToolTip id="setRooms">
                  <span>
                    Stelle hier die gewünschte Zimmeranzahl ein. Küche und
                    Badezimmer werden nicht als Zimmer gezählt. Bei halben
                    Zimmern wird die Zimmerzahl abgerundet.
                  </span>
                </ToolTip>
              </MapSliderLabel>
            )}
          {apiRoute === 'affordabilityH4' && (
            <MapSliderLabel iconName="people">
              <em className={bgColor === '#ffffff' && styles.currentColor}>
                {filterParams[attr]}
              </em>
              &nbsp;
              <p className="tooltip" data-tip data-for="H4">
                {filterParams[attr] === 1 ? <>Person</> : <>Personen</>}{' '}
                (Hartz-IV-Bedarfsgemeinschaft)
              </p>
              <ToolTip id="H4">
                <span>
                  Stelle hier die Personenzahl der Hartz-IV-Bedarfsgemeinschaft
                  ein.
                </span>
              </ToolTip>
            </MapSliderLabel>
          )}

          <Slider
            min={min}
            max={max}
            step={step}
            defaultValue={filterParams[attr]}
            onChange={value => handleSliderChange(attr, value)}
          />
        </div>
      );
    }
    return null;
  }
  function renderWBScheckBox() {
    return (
      <div className={styles.sliderLabel}>
        <label className="labelcheckmark" htmlFor="isSubsidized">
          <input
            type="checkbox"
            id="isSubsidized"
            onChange={event =>
              handleSliderChange(
                'includeSubsidizedHousing',
                event.target.checked
              )
            }
            defaultChecked={filterParams.includeSubsidizedHousing}
          />
          <span className="checkmark" />
          Angebote mit{' '}
          <span className="tooltip" data-tip data-for="WBS">
            WBS-Pflicht
          </span>{' '}
          berücksichtigen.
          <ToolTip id="WBS">
            <span>
              Mit einem Wohnberechtigungsschein (WBS) kannst du in eine Wohnung
              ziehen, die mit öffentlichen Mitteln gefördert wird.
            </span>
          </ToolTip>
        </label>
      </div>
    );
  }
  function renderBerlinMap() {
    return (
      <BerlinMap
        loading={loading}
        berlinDistricts={geoJsonWithLORData(berlinDistricts, lorData)}
        districtLayerKey={districtUpdate}
        districtStyle={districtStyle}
        districtTooltip={districtInfo}
        districtZoomInfo={districtZoomInfo}
        berlinInfo={berlinInfo}
        subtitle={!zoomedIn && INITIAL_SUBTITLE}
        onDistrictZoomIn={onDistrictZoomIn}
        onDistrictZoomOut={onDistrictZoomOut}
        bgColor={bgColor}
        legend={renderLegend()}
      >
        <GeoJSON
          key={apartmentUpdate}
          data={apartments}
          pointToLayer={(feature, latlng) =>
            circleMarker(latlng, style(feature))
          }
          onEachFeature={onEachApartment}
        />
      </BerlinMap>
    );
  }

  return lorData && berlinDistricts ? (
    <>
      <div className={styles.mapContainer}>
        {filters ? filters.map(renderFilterSlider) : null}
        {apiRoute === 'affordability' && renderWBScheckBox()}
        {altApiRoute ? renderRLButton() : null}
        {renderBerlinMap()}
      </div>
    </>
  ) : (
    <div className={styles.mapContainer}>Lade Karte...</div>
  );
};
