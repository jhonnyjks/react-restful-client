import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import User from '../users/index'
import Profile from '../profiles/index'
import { routes } from '../app/exports'

export default props => (
    <div className='content-wrapper'>
        <Switch>
            {/* Mapeando rotas do projeto filho */}
            {routes.map(route => (
                <Route key={route.path} exact={route.exact || false} path={route.path} component={route.component} />
            ))}

            <Route path='/users' component={User} />
            <Route path='/profiles' component={Profile} />
            <Redirect from='*' to='/' />
        </Switch>
    </div>
)