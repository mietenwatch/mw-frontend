/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import styles from './pressItem.module.scss';
import Image from '../../layout/image';

export default ({ logoSrc, href }) => (
  <li className={styles.pressItem}>
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Image name={logoSrc} />
    </a>
  </li>
);
