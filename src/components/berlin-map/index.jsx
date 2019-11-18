import React, { useState, useEffect, useRef } from 'react';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon, marker } from 'leaflet';
import styles from './berlin-map.module.scss';
import ringbahn from '../../../public/visualization-data/ringbahn.json';
import labels from '../../../public/visualization-data/district-labels.json';
import ZoomOutIcon from '../../images/icons/zoomOut';
import { bgColors } from '../../styles/variables';

export default ({
  berlinDistricts,
  onDistrictHover,
  children,
  districtStyle,
  districtTooltip,
  districtZoomInfo,
  berlinInfo,
  districtLayerKey,
  keepStyleOnZoom,
  keepTooltipOnZoom,
  onDistrictZoomIn,
  onDistrictZoomOut,
  loading,
  subtitle,
  bgColor,
  legend
}) => {
  const districtsRef = useRef(null);
  const mapRef = useRef(null);
  const ringbahnRef = useRef(null);
  const berlinMaskRef = useRef(null);
  const resizeTimer = useRef(null);

  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [zoomedDistrict, setZoomedDistrict] = useState(null);
  const [berlinMask, setBerlinMask] = useState(null);

  useEffect(() => {
    fetch('/visualization-data/berlin-mask.json')
      .then(res => res.json())
      .then(setBerlinMask);
  }, []);

  /* eslint-disable no-use-before-define */
  useEffect(() => {
    if (onDistrictHover) onDistrictHover(hoveredDistrict);
  }, [hoveredDistrict]);

  useEffect(() => {
    mainHandler();
  }, [zoomedDistrict]);

  useEffect(() => {
    if (!districtLayerKey) return;
    mainHandler();
  }, [districtLayerKey]);

  useEffect(() => {
    window.addEventListener('resize', startResizeTimer);

    return () => {
      clearTimeout(resizeTimer.current);
      window.removeEventListener('resize', mainHandler);
    };
  }, []);

  function startResizeTimer() {
    clearTimeout(resizeTimer.current);
    resizeTimer.current = setTimeout(() => {
      mainHandler();
    }, 500);
  }

  function mainHandler() {
    if (districtsRef.current) {
      const districtsLayer = districtsRef.current.leafletElement;
      const map = mapRef.current.leafletElement;

      if (zoomedDistrict) {
        map.fitBounds(zoomedDistrict.getBounds());
        zoomedInStyle(districtsLayer);
        if (onDistrictZoomIn) {
          onDistrictZoomIn(map.getBounds());
        }
      } else {
        map.fitBounds(districtsLayer.getBounds());
        zoomedOutStyle(districtsLayer);
        if (onDistrictZoomOut) onDistrictZoomOut();
      }
    }
  }
  /* eslint-enable no-use-before-define */

  function zoomedInStyle(layer) {
    layer.setStyle({ weight: 0, fillOpacity: keepStyleOnZoom ? 0.5 : 0 });
    zoomedDistrict.setStyle({ weight: 2.5, color: 'black' });
  }

  function zoomedOutStyle(layer) {
    layer.eachLayer(l => {
      l.setStyle(districtStyle(l.feature));
    });
  }

  function featureClick(layer) {
    setZoomedDistrict(layer);
  }

  function onEachDistrict(feature, layer) {
    if (districtTooltip) {
      layer.bindTooltip(districtTooltip(feature), {
        closeButton: false,
        direction: 'left',
        sticky: true
      });
    }

    layer.on({
      mouseover: () => {
        // eslint-disable-next-line no-underscore-dangle
        if (layer._map.getZoom() > 11 && !keepTooltipOnZoom) {
          // openTooltip is called automatically, so close it to avoid visibility:
          layer.closeTooltip();
        }
        setHoveredDistrict(layer);
      },
      click: () => {
        layer.closeTooltip();
        featureClick(layer);
      }
    });

    layer.setStyle(districtStyle(feature));
  }

  function makeLabels(feature, latlng) {
    const icon = divIcon({
      className: 'mapDistrictLabel',
      iconSize: [80, 20],
      iconAnchor: [40, 0],
      html: feature.properties.name
    });

    return marker(latlng, { icon, interactive: false });
  }

  function reassignZoomedDistrict(layer) {
    /* filters update district layer, thus zoomedDistrict must be reassigned */
    /* eslint-disable no-underscore-dangle */
    const compProp = zoomedDistrict.feature.properties.SCHLUESSEL
      ? 'SCHLUESSEL'
      : 'ORT';
    const d = Object.values(layer._layers).find(
      l =>
        l.feature.properties[compProp] ===
        zoomedDistrict.feature.properties[compProp]
    );
    /* eslint-enable no-underscore-dangle */
    setZoomedDistrict(d);
  }

  function initialZoom(event) {
    const layer = event.target;
    if (zoomedDistrict) {
      reassignZoomedDistrict(layer);
      layer._map.fitBounds(zoomedDistrict.getBounds()); // eslint-disable-line no-underscore-dangle
    } else {
      layer._map.fitBounds(layer.getBounds()); // eslint-disable-line no-underscore-dangle
    }
  }

  function renderBackButton() {
    if (zoomedDistrict) {
      return (
        <button
          className={styles.backButton}
          type="button"
          onClick={() => setZoomedDistrict()}
        >
          <ZoomOutIcon width="30" />
        </button>
      );
    }
    return null;
  }

  function renderZoomedDistrictInfo() {
    if (zoomedDistrict && districtZoomInfo) {
      return districtZoomInfo(zoomedDistrict);
    }
    return null;
  }

  function renderBerlinInfo() {
    if (!zoomedDistrict && berlinInfo) {
      return berlinInfo();
    }
    return null;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className={styles.mapContainer}>
      <Map
        ref={mapRef}
        className={loading ? `${styles.map} ${styles.loading}` : styles.map}
        center={[52.5, 13.5]}
        zoom={10}
        zoomSnap={0.2}
        zoomAnimation={false}
        zoomControl={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        dragging={false}
        tap={false}
        bgColor={bgColors.pink}
      >
        {renderBackButton()}

        {zoomedDistrict ? null : legend}

        {berlinMask ? (
          <>
            <GeoJSON
              ref={districtsRef}
              key={districtLayerKey}
              data={berlinDistricts}
              onEachFeature={onEachDistrict}
              onAdd={initialZoom}
              style={{
                fillOpacity: 0,
                weight: 0.3,
                opacity: 0.5,
                color: 'black'
              }}
              smoothFactor={0.3}
            />

            <GeoJSON
              ref={berlinMaskRef}
              data={berlinMask}
              key={`${districtLayerKey}_mask`}
              style={{
                color: 'black',
                fillColor: bgColor,
                weight: 1.5,
                fillOpacity: 1,
                zIndex: 200
              }}
            />

            <GeoJSON
              data={labels}
              key={`${districtLayerKey}_labels`} // do also update this with districts to get it in front
              pointToLayer={makeLabels}
            />

            <GeoJSON
              ref={ringbahnRef}
              data={ringbahn}
              key={`${districtLayerKey}_ringbahn`} // do also update this with districts to get it in front
              style={{ color: 'black', weight: 1, dashArray: '3 6' }}
            />

            {children}
            <TileLayer url="https://map.mietenwatch.de/styles/klokantech-basic/{z}/{x}/{y}.png" />
          </>
        ) : (
          <div className={styles.mapContainer}>Lade Karte...</div>
        )}
      </Map>

      {subtitle}
      {renderZoomedDistrictInfo() || renderBerlinInfo()}
    </div>
  );
};
