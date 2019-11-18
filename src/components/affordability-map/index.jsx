import React from 'react';
import { bgColors } from '../../styles/variables';
import AffordabilityMap from './affordability-map-base';

export function AffordabilityMapCustom() {
  return (
    <AffordabilityMap
      apiRoute="affordability"
      initialFilterParams={{ income: 2500, rooms: 2 }}
      filters={[
        ['income', 0, 5000, 100],
        ['rooms', 1, 5, 1],
        ['includeSubsidizedHousing', false]
      ]}
      bgColor={bgColors.pink}
    />
  );
}

export function AffordabilityMapAverage({ bgWhite }) {
  return (
    <AffordabilityMap
      apiRoute="affordabilityAVG"
      initialFilterParams={{ income: 2625, rooms: 2 }}
      filters={[['rooms', 1, 5, 1]]}
      roomsToIncome={[1375, 2625, 3075, 3425, 3000]}
      bgColor={bgWhite ? bgColors.white : bgColors.pink}
    />
  );
}

export function AffordabilityMapH4() {
  return (
    <AffordabilityMap
      apiRoute="affordabilityH4"
      initialFilterParams={{ income: 553, rooms: 2 }}
      filters={[['rooms', 1, 5, 1]]}
      roomsToIncome={[472, 553, 713, 802, 933]}
      bgColor={bgColors.pink}
    />
  );
}

export function AffordabilityMapDeckel({ bgWhite }) {
  return (
    <AffordabilityMap
      altApiRoute="affordabilityWoRL"
      apiRoute="affordabilityWRL"
      initialFilterParams={{ income: 2500, rooms: 2 }}
      filters={[['income', 0, 5000, 100], ['rooms', 1, 5, 1]]}
      bgColor={bgWhite ? bgColors.white : bgColors.turquoise}
    />
  );
}

export default {
  AffordabilityMapCustom,
  AffordabilityMapAverage,
  AffordabilityMapH4,
  AffordabilityMapDeckel
};
