module.exports = {
  siteMetadata: {
    title: 'Mietenwatch — Berlins Mietmarkt unter der Lupe',
    titleTemplate: '%s',
    description:
      'Berlins Mietmarkt unter der Lupe: Mietenwatch analysiert 80.000 Angebote und zeigt wie dramatisch die Marktlage ist.',
    url: 'https://www.mietenwatch.de', // No trailing slash allowed!
    image: '/images/og_image_mietenwatch.jpg', // Path to your image you placed in the 'static' folder
    twitterUsername: '@mietenwatch'
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        defaultLayouts: {
          default: require.resolve('./src/components/with-layout/index.jsx')
        }
      }
    },
    {
      resolve: `gatsby-plugin-react-leaflet`,
      options: {
        linkStyles: false
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mietenwatch`,
        short_name: `Mietenwatch`,
        start_url: `/`,
        background_color: `#dd8893`,
        theme_color: `#dd8893`,
        display: `minimal-ui`,
        icon: `./src/images/icons/favicon.png`
      }
    },
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Work Sans`,
            variants: [`400`, `400i`, `600`],
            subsets: [`latin`]
          },
          {
            family: `Alegreya`,
            variants: [`400`, `400i`, `700`]
          },
          {
            family: `Gochi Hand`
          }
        ]
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/images`,
        name: 'images'
      }
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        allPageHeaders: ['Link: <https://api.mietenwatch.de>; rel=preconnect;']
      }
    },
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sass',
    'gatsby-plugin-webpack-bundle-analyzer',
    'gatsby-plugin-no-sourcemaps'
  ]
};
