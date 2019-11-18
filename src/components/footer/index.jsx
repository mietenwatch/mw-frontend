import React from 'react';
import Link from 'gatsby-link';
import styles from './footer.module.scss';
import Image from '../layout/image';

export default () => (
  <footer className={styles.footer}>
    <div className={styles.footer__logo}>
      <p className={styles.footer__heading}>Mietenwatch</p>
    </div>
    <div className={styles.footer__contact}>
      <p>
        <strong>Mietenwatch</strong> | Tilman Miraß | Lausitzer Straße 10,
        Aufgang A, 10999 Berlin | 01523 8702063 |{' '}
        <a href="mailto:info@mietenwatch.de">info@mietenwatch.de</a>
      </p>
      <p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/mietenwatch"
        >
          Twitter
        </a>{' '}
        |{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/Mietenwatch"
        >
          Facebook
        </a>{' '}
        |{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.github.com/mietenwatch/mietenwatch"
        >
          Github
        </a>{' '}
        | <Link to="/#faq">FAQ</Link> | <Link to="/impressum">Impressum</Link> |{' '}
        <Link to="/datenschutz">Datenschutzerklärung</Link>
      </p>
    </div>
    <div>
      <p>gefördert von</p>
      <ul className={styles.footer__logos}>
        <li>
          <Image
            name="gefoerdert-vom-bmbf.png"
            className={styles.footer__logo}
            objectFit="contain"
          />
        </li>
        <li>und</li>
        <li>
          <Image
            name="sponsor-prototype.png"
            className={styles.footer__logo}
            objectFit="contain"
          />
        </li>
      </ul>
    </div>
  </footer>
);
