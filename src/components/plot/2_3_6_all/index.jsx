/* eslint-disable react/jsx-pascal-case */
/* eslint-disable camelcase */

import React, { useState } from 'react';

import LayoutConstraint from '../../layout-constraint';
import Plot2_3_6, { reducer } from '../2_3_6';
import {
  title as titleStyle,
  subtitle as subtitleStyle
} from '../plot/plot.module.scss';
import { wrapper as wrapperStyle, chartWrapper } from './style.module.scss';
import useFetch from '../plot/use-fetch';

const allCompanies = [
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

export default ({ source, title, subtitle, ...props }) => {
  const fetchedData = useFetch(source, reducer);
  const [companies, setCompanies] = useState({
    1: 'Deutsche Wohnen',
    2: 'Gewobag'
  });

  return (
    <>
      {title && (
        <LayoutConstraint>
          <h3 className={titleStyle}>
            {title}{' '}
            {subtitle && <small className={subtitleStyle}>{subtitle}</small>}
          </h3>
        </LayoutConstraint>
      )}
      <div className={wrapperStyle}>
        {Object.values(companies).map((companyTitle, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`plot-${index}-${companyTitle}`}
            className={chartWrapper}
          >
            <select
              onChange={event => {
                setCompanies({ ...companies, [index + 1]: event.target.value });
              }}
            >
              {allCompanies.map(company => (
                <option
                  // eslint-disable-next-line react/no-array-index-key
                  key={`select-${index}-${company}`}
                  selected={company === companyTitle}
                >
                  {company}
                </option>
              ))}
            </select>

            {fetchedData !== null ? (
              <Plot2_3_6
                {...props}
                data={fetchedData}
                title={companyTitle}
                noMarginTop
                showTitle={false}
              />
            ) : (
              <p>Loading data ...</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
