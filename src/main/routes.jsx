import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Dashboard from '../dashboard/dashboard'
import User from '../users/index'
import Profile from '../profiles/index'

export default props => (
    <div className='content-wrapper'>
        <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route path='/users' component={User} />
            <Route path='/profiles' component={Profile} />
            <Redirect from='*' to='/' />
        </Switch>
    </div>
)