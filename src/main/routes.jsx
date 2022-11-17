import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import { routes as defaultRoutes } from '../default'
import { routes } from '../app/exports'

const AppRoutes = [...routes, ...defaultRoutes]

export default props => (
    <div className='content-wrapper'>
        <Switch>
            {/* Mapeando rotas do projeto filho */}
            {AppRoutes.map(route => (
                <Route key={route.path} exact={route.exact || false} path={route.path} component={route.component} />
            ))}

            {/* Mapeando rotas do projeto filho que tem crud */}
            {AppRoutes.map(route => (
                route.isCrud !== false ? <Route key={route.path + '/:id'} exact={route.exact || false} path={route.path + '/:id'} component={route.component} /> : null
            ))}

            <Redirect from='*' to='/' />
        </Switch>
    </div>
)