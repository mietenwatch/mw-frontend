import React from 'react';
import DataTable from 'react-data-table-component';
import data from '../../../static/visualization-data/2.5.4_NKM_KostendeckMiete_SurplusMiete_BigPlayers_Tabelle';

const columns = [
  {
    name: 'Anbieter',
    selector: 'Anbieter',
    sortable: true
  },
  {
    name: 'Nettokaltmiete in €/m²',
    selector: 'Nettokaltmiete in €/m²',
    sortable: true
  },
  {
    name: 'Kostendeckende Miete in €/m²',
    selector: 'Kostendeckende Miete in €/m²',
    sortable: true
  },
  {
    name: 'Überschussmiete in €/m²',
    selector: 'Überschussmiete in €/m²',
    sortable: true
  }
];

export default ({ title }) => (
  <DataTable title={title} columns={columns} data={data} dense />
);
