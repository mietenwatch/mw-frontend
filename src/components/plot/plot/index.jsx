import classnames from 'classnames';
import React, { lazy, Suspense } from 'react';

import {
  title as titleStyle,
  subtitle as subtitleStyle,
  plot as plotStyle,
  plotWrapper as plotWrapperStyle,
  plotWrapperNoMargin as plotWrapperNoMarginStyle,
  moreInformationTrigger
} from './plot.module.scss';
import { leistbarkeitColors, fonts } from '../../../styles/variables';
import useFetch from './use-fetch';
import Modal from '../../modal';

const Plotly = lazy(() => import('./plotly'));

const axisStyle = {
  automargin: true,
  // disable x zoom
  fixedrange: true,
  gridcolor: 'rgba(255, 255, 255, .4)',
  ticks: 'outside',
  tickcolor: 'transparent',
  ticklen: 2,
  zerolinecolor: 'rgba(255, 255, 255, .4)',
  tickfont: {
    family: fonts.sans,
    size: 13
  },
  titlefont: {
    family: fonts.sans,
    size: 15
  }
};

const Header = ({ title, subtitle }) => (
  <header>
    {(title || subtitle) && (
      <h3 className={titleStyle}>
        {title}{' '}
        {subtitle && <small className={subtitleStyle}>{subtitle}</small>}
      </h3>
    )}
  </header>
);

export default ({
  source,
  title,
  subtitle = null,
  children,
  layout = {},
  data = null,
  reducer = rawData => rawData,
  noMarginTop = false,
  showTitle = true,
  ...props
}) => {
  let fetchedData = null;

  if (data !== null) {
    fetchedData = data;
  } else {
    fetchedData = useFetch(source, reducer);
  }

  const layoutWithDefaults = {
    ...layout,
    autosize: true,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    title: null,
    hoverlabel: {
      bgcolor: 'white',
      bordercolor: 'white',
      opacity: 1,
      font: {
        color: 'black',
        family: fonts.sans,
        size: 12
      },
      ...layout.hoverlabel
    },
    font: {
      color: leistbarkeitColors.leist_p
    },
    hovermode: 'closest',
    margin: {
      ...layout.margin,
      r: 10,
      t: 0
    },
    xaxis: {
      ...axisStyle,
      showgrid: false,
      ...layout.xaxis
    },
    xaxis2: {
      ...axisStyle,
      showgrid: false,
      ...(layout.xaxis2 && layout.xaxis2)
    },
    yaxis: {
      ...axisStyle,
      ...layout.yaxis
    },
    legend: {
      orientation: 'h',
      y: 1.12,
      font: {
        family: fonts.sans,
        size: 13
      },
      ...layout.legend
    }
  };

  if (fetchedData === null) {
    return <p>Daten werden geladen …</p>;
  }

  return (
    <div
      className={classnames(
        plotWrapperStyle,
        noMarginTop && plotWrapperNoMarginStyle
      )}
    >
      {showTitle && <Header title={title} subtitle={subtitle} />}

      <Suspense fallback={<p>Diagramm wird geladen …</p>}>
        <Plotly
          className={plotStyle}
          data={fetchedData}
          layout={layoutWithDefaults}
          config={{ displayModeBar: false, showLink: false }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
          {...props}
        />
      </Suspense>

      {children && (
        <Modal
          modalLink="mehr Informationen"
          triggerStyles={moreInformationTrigger}
          showIcon
        >
          {children}
        </Modal>
      )}
    </div>
  );
};
