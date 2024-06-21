import React, { Component } from 'react'
import { connect } from 'react-redux'

import MenuItem from './MenuItem'
import MenuTree from './MenuTree'
import { menu as defaultMenu } from '../../default'
import { menu } from '../../app/exports'
import ProfileHeader from './ProfileHeader';

const MainMenu = {...defaultMenu, ...menu}

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
                <div style={{ marginTop: '40px' }}>
                    <ul className='nav nav-pills nav-sidebar flex-column'>
                        {Object.keys(MainMenu).map((path) => {

                            const item = MainMenu[path]
                            
                            if (!(item.excludeFromProfiles && item.excludeFromProfiles.indexOf(this.props.profile.id) > -1) && 
                                (item.fixed || scopes[path] || scopes[path.replace('/', '')])) {

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
                <ProfileHeader/>
            </div>
        )
    }
}

const mapStateToProps = state => ({ scopes: state.auth.profile.scopes, profile: state.auth.profile })
export default connect(mapStateToProps, null)(Menu)