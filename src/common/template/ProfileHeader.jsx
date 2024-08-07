import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

import { logout } from '../../default/auth/authActions'

class ProfileHeader extends Component {
    constructor(props) {
        super(props)
        this.state = { open: false }
    }
    changeOpen(e) {
        e.preventDefault()
        this.setState({ open: !this.state.open })
    }

    RenderSidebarMenu = () => {
        return (
            <React.Fragment>
                <div className="mt-2">
                    <ul className='nav nav-pills nav-sidebar flex-column'>
                        <li className="nav-item">
                            <div href="#!" className="nav-link">
                                <i className="nav-icon fas fa-power-off"></i>
                                <span> Deseja Sair?</span>
                            </div>
                        </li>
                        <li className="nav-item mb-1">
                            <a href="#!" className="nav-link bg-success" onClick={this.props.logout}>
                                <i className="nav-icon fas fa-check"></i>
                                <span> Sim</span>
                            </a>
                        </li>
                        <li className="nav-item mb-1">
                            <a href="#!" className="nav-link bg-danger" onClick={(e) => this.changeOpen(e)}>
                                <i className="nav-icon fas fa-times"></i>
                                <span> Não</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="user-panel mt-1 pb-1 mb-1 d-flex"></div>
            </React.Fragment>
        )
    }

    render() {
        const { name, /*email*/ } = this.props.user
        const { RenderSidebarMenu } = this
        return (
            <React.Fragment>
                <div className="user-panel mt-3 pb-3 mb-1 d-flex">
                    <div className="image">
                        <i className="nav-icon fas fa-sign-out-alt"></i>
                    </div>
                    <div className="info">
                        <a href="#!" className="d-block">{name}</a>
                        <a href="#!" className="d-block">Perfil: {this.props.profile.noun}</a>
                        <div style={{ display: 'flex', flexDirection: 'column' }} >
                            <a href="#!" className="d-block mt-2 btn btn-secondary btn-sm" onClick={(e) => this.changeOpen(e)}>
                                <i className="nav-icon fas fa-power-off"></i>
                                <span> Sair</span>
                            </a>
                            {
                                this.props.profiles.length > 1 && <Link to="/trocar-perfil" className="d-block mt-2 btn btn-secondary btn-sm">
                                    <i className="nav-icon fas fa-random"></i>
                                    <span>Trocar Perfil</span>
                                </Link>
                            }
                        </div>
                    </div>
                </div>
                {this.state.open && (<RenderSidebarMenu />)}
            </React.Fragment>
        )
    }
}
const mapStateToProps = state => ({ user: state.auth.user, profile: state.auth.profile, profiles: state.auth.profiles })
const mapDispatchToProps = dispatch => bindActionCreators({ logout }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeader)