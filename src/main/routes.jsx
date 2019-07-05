import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import { routes } from '../app/exports'

export default props => (
    <div className='content-wrapper'>
        <Switch>
            {/* Mapeando rotas do projeto filho */}
            {routes.map(route => (
                <Route key={route.path} exact={route.exact || false} path={route.path} component={route.component} />
            ))}

            <Redirect from='*' to='/' />
        </Switch>
    </div>
)