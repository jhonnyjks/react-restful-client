import React from 'react';
import DefaultProfiles from '../default/profiles';
import DoughnutChart from '../common/layout/widget/chart/DoughnutChart';
import TwoAxesChart from '../common/layout/widget/chart/TwoAxesChart';

function StandardContractFixture() {
  return React.createElement(
    'div',
    null,
    React.createElement(DefaultProfiles),
    React.createElement(DoughnutChart, {
      chart: { data: [] },
      valueField: 'value',
      argumentField: 'label',
      title: 'Distribuição',
    }),
    React.createElement(TwoAxesChart, {
      chart: { data: [] },
      series: [],
      argumentField: 'label',
      title: 'Série',
    }),
  );
}

export const reducers = {};

export const routes = [
  { exact: true, path: '/fixture', component: StandardContractFixture, isCrud: false },
];

export const menu = {
  '/fixture': { title: 'Fixture padrão', icon: 'lock', fixed: true },
};
