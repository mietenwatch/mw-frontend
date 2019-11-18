# Mietenwatch Frontend

Frontend for [mietenwatch.de](https://www.mietenwatch.de)

## Structure

- `src/pages`: Contains all pages. Pages can be either MDX or JSX templates.
- `src/components`: Contains all React components used throughout the SPA.

## Development Setup

First you need to install the project dependencies

```bash
npm install
```

Afterwards running

```bash
npm run develop
```

will start the development server at [localhost:8000](http://localhost:8000/).

## Production Build

In order to compile the page for production, please run

```bash
npm run build
```

Now you should be able to serve `./public` to your users.


This project was funded by the German Federal Ministry of Education and Research within the Prototype Fund funding line organized by Open Knowledge Fundation.


![gefördert vom BMBF](https://raw.githubusercontent.com/mietenwatch/mietenwatch/master/static/bmbfgefoerdert.jpg)
