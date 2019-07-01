import React, { Component } from 'react'
import { connect } from 'react-redux'

import MenuItem from './MenuItem'
import MenuTree from './MenuTree'
import { menu } from '../../app/exports'

class Menu extends Component {

    renderDinamicMenu(path, menuItem) {
        return <MenuItem
            key={path} path={path}
            label={menuItem.title} icon={menuItem.icon}
        />
    }

    render() {
        const scopes = this.props.scopes
        return (
            <ul className='sidebar-menu'>
                <MenuItem path='/' label='Dashboard' icon='dashboard' />

                {Object.keys(scopes).map((path) => {

                    if (menu[path]) {
                        const item = menu[path]
                        if (item.children) {
                            return <MenuTree
                                key={path} path={path}
                                label={item.title} icon='users'
                            >
                                {Object.keys(item.children).map((childPath) => {
                                    return this.renderDinamicMenu(childPath, item.children[childPath])
                                })}
                            </MenuTree>

                        } else {
                            return this.renderDinamicMenu(path, item)
                        }
                    }

                    return false
                })}
            </ul>
        )
    }
}

const mapStateToProps = state => ({ scopes: state.auth.profile.scopes })
export default connect(mapStateToProps, null)(Menu)