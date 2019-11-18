import React from 'react';
import heroStyles from './heroStyles.module.scss';
import Image from '../layout/image';

export default ({ title, children }) => (
  <section className={heroStyles.hero}>
    <Image name="landing_bg.jpg" className={heroStyles.hero__image} />
    <div className={heroStyles.hero__titleContainer}>
      <h1 className={heroStyles.hero__title}>{title}</h1>
      <p className={heroStyles.hero__subtitle}>{children}</p>
    </div>
  </section>
);
