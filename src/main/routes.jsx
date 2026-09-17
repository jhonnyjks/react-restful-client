import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect, withRouter } from 'react-router'

import { routes as defaultRoutes } from '../default'
import { routes } from '../app/exports'

const AppRoutes = [...routes, ...defaultRoutes]

/** Rotas liberadas sem cpath de menu correspondente (ex.: Crash usa fixed no menu). */
function canAccessRoute(path, scopes = {}) {
    if (!path || path === '/') return true
    // Crash fica no menu com fixed:true; ACL fino fica nas APIs (signals/results/prompts).
    if (path === '/crash') return true
    if (path === '/trocar-perfil') return true
    // Sem scopes ainda: bloqueia users/profiles até o define_profile.
    if (!scopes || Object.keys(scopes).length === 0) return false
    const key = path.replace(/^\//, '')
    return !!(scopes[path] || scopes[key])
}

function renderGuarded(route, scopes) {
    return (props) => {
        if (!canAccessRoute(route.path, scopes)) {
            return <Redirect to="/" />
        }
        const Comp = route.component
        return <Comp {...props} />
    }
}

const Routes = ({ scopes }) => (
    <div className='content-wrapper'>
        <Switch>
            {AppRoutes.map(route => (
                <Route
                    key={route.path}
                    exact={route.exact || false}
                    path={route.path}
                    render={renderGuarded(route, scopes)}
                />
            ))}

            {AppRoutes.map(route => (
                route.isCrud !== false ? (
                    <Route
                        key={route.path + '/:id'}
                        exact={route.exact || false}
                        path={route.path + '/:id'}
                        render={renderGuarded(route, scopes)}
                    />
                ) : null
            ))}

            <Redirect from='*' to='/' />
        </Switch>
    </div>
)

const mapStateToProps = state => ({
    scopes: (state.auth.profile && state.auth.profile.scopes) || {}
})

export default withRouter(connect(mapStateToProps)(Routes))
