import DefaultProfiles from '../default/profiles';

export const reducers = {};

export const routes = [
  { exact: true, path: '/fixture', component: DefaultProfiles, isCrud: false },
];

export const menu = {
  '/fixture': { title: 'Fixture padrão', icon: 'lock', fixed: true },
};
