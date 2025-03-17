import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { logout } from '../../default/auth/authActions';

class ProfileHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
        this.changeOpen = this.changeOpen.bind(this);
    }

    changeOpen(e) {
        e.preventDefault();
        this.setState({ open: !this.state.open });
    }

    RenderSidebarMenu = () => {

        const { hover } = this.props;

        return (
            <React.Fragment>
                <div className="mt-2">

                    {this.state.open && hover && (
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
                                    <a href="#!" className="nav-link bg-danger" onClick={this.changeOpen}>
                                        <i className="nav-icon fas fa-times"></i>
                                        <span> Não</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}

                    {!hover && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <a href="#!" className="d-block mt-2 btn btn-secondary btn-sm">
                                <i className="nav-icon fas fa-question"></i>
                            </a>
                            <a href="#!" className="d-block mt-2 btn btn-success btn-sm">
                                <i className="nav-icon fas fa-check"></i>
                            </a>
                            <a href="#!" className="d-block mt-2 btn btn-danger btn-sm">
                                <i className="nav-icon fas fa-times"></i>
                            </a>
                        </div>
                    )}
                </div>
                <div className="user-panel mt-1 pb-1 mb-1 d-flex"></div>
            </React.Fragment>
        );
    }

    render() {
        const { name, /*email*/ } = this.props.user;
        const entity = this.props.entities.length != 0 ? this.props.entities[0].entity :null;
        
        const { hover } = this.props;

        return (
            <React.Fragment>
                <div className="row">
                    <div className='col-md-12 col-7'>
                        {this.props.profiles.length > 1 && (
                            <Link to="/trocar-perfil" className="mt-2 btn-block btn btn-secondary btn-sm custom-bg-color" style={{ color: '' }}>
                                <i className="nav-icon fas fa-sync-alt"></i>
                                {hover && <span style={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', paddingLeft: '10px' }}>Trocar Perfil</span>}
                            </Link>
                        )}
                    </div>
                    <div className='col-md-12 col-5'>
                        <a href="#!" className="mt-2 btn-block btn btn-secondary btn-sm custom-bg-color" onClick={(e) => this.changeOpen(e)}>
                            <i className="nav-icon fas fa-power-off"></i>
                            {hover && <span> Sair</span>}
                        </a>

                    </div>

                </div>

                {this.state.open && (<this.RenderSidebarMenu />)}

                <div className={`user-panel mt-3 pb-3 mb-1 d-flex align-items-center ${hover ? '' : 'justify-content-center'}`} style={{ borderBottom: 'none' }}>
                    <div className={`image ${hover ? '' : 'text-center'}`}>
                        <img src="https://dummyimage.com/160x160/fff/ggg" className="img-circle elevation-2" alt="User" />
                    </div>
                    {hover && (
                        <div className="info pl-3">
                            <a href="#!" className="d-block text-white font-weight-bold">{name}</a>
                            <a href="#!" title={`${this.props.profile.noun} / ${entity?entity.name:''}`} className="d-block text-white">{this.props.profile.noun} / {entity?entity.initials:''}</a>
                        </div>
                    )}
                </div>

            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ user: state.auth.user, profile: state.auth.profile, profiles: state.auth.profiles,entities: state.auth.entities });
const mapDispatchToProps = dispatch => bindActionCreators({ logout }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(ProfileHeader);
