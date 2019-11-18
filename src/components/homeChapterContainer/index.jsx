import React from 'react';
import styles from './homeChapterContainer.module.css';

export default ({ children }) => (
  <ul className={styles.homeChapterContainer}>{children}</ul>
);
