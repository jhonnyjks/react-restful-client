import React, { Component } from 'react'
import { connect } from 'react-redux'

import MenuItem from './MenuItem'
import MenuTree from './MenuTree'
import { menu } from '../../app/exports'
import ProfileHeader from './ProfileHeader';

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
            <div>
                <ProfileHeader/>
                <div className="mt-2">
                    <ul className='nav nav-pills nav-sidebar flex-column'>
                        {Object.keys(menu).map((path) => {

                            const item = menu[path]

                            if (item.fixed || scopes[path] || scopes[path.replace('/', '')]) {

                                if (item.children) {
                                    return <MenuTree
                                        key={path} path={path}
                                        label={item.title} icon={item.icon}
                                    >
                                        {Object.keys(item.children).map((childPath) => {
                                            return this.renderDinamicMenu(childPath, item.children[childPath])
                                        })}
                                    </MenuTree>

                                } else {
                                    return this.renderDinamicMenu(path, item)
                                }

                            } else if (path === ('/' || '')) {
                                return this.renderDinamicMenu(path, item)
                            }

                            return false
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ scopes: state.auth.profile.scopes })
export default connect(mapStateToProps, null)(Menu)