import React from 'react';
import styles from './section.module.scss';

export default ({ children, ...props }) => (
  <section className={styles.section} {...props}>
    {children}
  </section>
);
