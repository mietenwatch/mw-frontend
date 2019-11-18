import React from 'react';
import styles from './illustratedText.module.scss';
import Image from '../layout/image';

export default ({ ...props }) => {
  const { textLeft, imgSrc, imgAlt, children, bgColor, id, className } = props;
  let { cssClassBgColor, cssClasses } = '';
  const inlineStyles = {
    flexDirection: textLeft ? 'row-reverse' : 'row'
  };
  switch (bgColor) {
    case 'yellow':
      cssClassBgColor = 'bg--yellow';
      break;
    case 'blue':
      cssClassBgColor = 'bg--blue';
      break;
    case 'pink':
      cssClassBgColor = 'bg--pink';
      break;
    default:
      break;
  }
  cssClasses = `${styles.container} ${cssClassBgColor}`;
  return (
    <div className={cssClasses} style={inlineStyles} id={id}>
      <Image
        name={imgSrc}
        alt={imgAlt}
        className={`${styles.image} ${className}`}
      />
      <div className={styles.text}>{children}</div>
    </div>
  );
};
