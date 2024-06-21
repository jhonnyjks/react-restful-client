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

                <div>
                    <div style={{ display: 'flex', flexDirection: 'column' }} >
                        {
                            this.props.profiles.length > 1 && <Link to="/trocar-perfil" className="d-block mt-2 btn btn-secondary btn-sm custom-bg-color" style={{ color: '' }}>
                                <i className="nav-icon fas fa-sync-alt" style={{ width: '16.67px', height: '16.67px', top: '1.67px', left: '1.67px' }}></i>
                                <span style={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', paddingLeft: '10px' }}>Trocar Perfil</span>
                            </Link>
                        }
                        <a href="#!" className="d-block mt-2 btn btn-secondary btn-sm custom-bg-color" onClick={(e) => this.changeOpen(e)}>
                            <i className="nav-icon fas fa-power-off"></i>
                            <span> Sair</span>
                        </a>
                    </div>
                </div>

                {this.state.open && (<RenderSidebarMenu />)}

                <div className="user-panel mt-3 pb-3 mb-1 d-flex align-items-center" style={{ borderBottom: 'none' }}>
                    <div className="image">
                        <img src="https://dummyimage.com/160x160/fff/ggg" className="img-circle elevation-2" alt="User" />
                    </div>
                    <div className="info pl-3">
                        <a href="#!" className="d-block">{name}</a>
                        <a href="#!" className="d-block">Perfil: {this.props.profile.noun}</a>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}
const mapStateToProps = state => ({ user: state.auth.user, profile: state.auth.profile, profiles: state.auth.profiles })
const mapDispatchToProps = dispatch => bindActionCreators({ logout }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeader)