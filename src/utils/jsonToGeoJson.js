import geoJsonConverter from 'geojson';

const jsonToGeoJson = function jsonToGeoJson(json) {
  const featureCollection = { type: 'FeatureCollection', features: [] };

  function toGeoJson(row) {
    const feature = geoJsonConverter.parse(row, {
      Point: ['geo_lat', 'geo_lon']
    });
    if (feature.geometry.coordinates) {
      featureCollection.features.push(feature);
    }
  }

  json.forEach(toGeoJson);
  return featureCollection;
};

export default jsonToGeoJson;
