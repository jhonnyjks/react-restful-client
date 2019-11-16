import React, { Component } from 'react'
import { connect } from 'react-redux'

import MenuItem from './MenuItem'
import MenuTree from './MenuTree'
import { menu } from '../../app/exports'

class Menu extends Component {

    constructor(props) {
        super(props)
        this.state = {
            openSidebarMenu: false
        }
    }

    openClose = () => {
        this.setState({ openSidebarMenu: !this.state.openSidebarMenu })
    }

    renderDinamicMenu(path, menuItem) {
        return <MenuItem
            key={path} path={path}
            label={menuItem.title} icon={menuItem.icon}
        />
    }

    RenderSidebarMenu = () => {
        return (
            <React.Fragment>
                <div className="mt-2">
                    <ul className='nav nav-pills nav-sidebar flex-column'>
                        <li className="nav-item">
                            <a href="#!" className="nav-link">
                                <i className="nav-icon fas fa-power-off"></i>
                                <span> Sair</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="user-panel mt-1 pb-1 mb-1 d-flex"></div>
            </React.Fragment>
        )
    }

    render() {
        const scopes = this.props.scopes
        const { RenderSidebarMenu } = this
        return (
            <div>
                <div className="user-panel mt-3 pb-3 mb-1 d-flex">
                    <div className="image">
                        <img src="http://lorempixel.com/160/160/people" className="img-circle elevation-2" alt="User" />
                    </div>
                    <div className="info">
                        <a href="#!" className="d-block">Alexander Pierce</a>
                        <a href="#!" className="d-block" onClick={() => this.openClose()}>Menu</a>
                    </div>
                </div>
                {this.state.openSidebarMenu && (<RenderSidebarMenu />)}
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