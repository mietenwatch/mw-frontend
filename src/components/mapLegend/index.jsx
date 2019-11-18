import React from 'react';
import styles from './mapLegend.module.scss';

// This component must be placed inside a relativly
// positioned div to be placed correctly
export default ({
  valuesBelowZero,
  valuesWithColors,
  header,
  appendix,
  bgColor
}) => {
  const rows = valuesWithColors.map(item => (
    <div className={styles.item} key={item[0]}>
      <div
        className={styles.color}
        key={item[0]}
        style={{ backgroundColor: item[1] }}
      />
      <div className={styles.text}>
        {valuesBelowZero && item[0] === 0 ? '≤ 0' : item[0]} {appendix}
      </div>
    </div>
  ));

  return (
    <div className={styles.mapLegend} style={{ backgroundColor: bgColor }}>
      <b style={{ lineHeight: '1.1' }}>{header}</b>
      {rows}
    </div>
  );
};
