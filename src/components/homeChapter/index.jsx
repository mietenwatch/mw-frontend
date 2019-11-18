import React from 'react';
import Link from 'gatsby-link';
import styles from './homeChapter.module.scss';
import Image from '../layout/image';

export default ({ title, imgSrc, imgAlt, href, grayOut, children }) => (
  <li className={styles.homeChapter}>
    <Image
      name={imgSrc}
      alt={imgAlt}
      className={styles.homeChapter__image}
      objectFit="cover"
      objectPosition="50% 50%"
    />
    <div className={styles.homeChapter__textContainer}>
      <h2 className={styles.homeChapter__title}>{title}</h2>
      <p className={styles.homeChapter__text}>{children}</p>
      {grayOut ? (
        <>
          <h3>Dieses Kapitel wird morgen veröffentlicht.</h3>
          <div className="grayOutWrapper">
            <Link to={href} className={styles.homeChapter__button}>
              Kapitel beginnen
            </Link>
          </div>
        </>
      ) : (
        <Link to={href} className={styles.homeChapter__button}>
          Kapitel beginnen
        </Link>
      )}
    </div>
  </li>
);
