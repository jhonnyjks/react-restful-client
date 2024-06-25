import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toastr } from 'react-redux-toastr'

import './auth.css'
import { login, signup, selectProfile } from './authActions'
import Row from '../../common/layout/row'
// import Grid from '../../common/layout/grid'
import Messages from '../../common/msg/Message'
import Input from '../../common/form/InputAuth'

class Auth extends Component {
    constructor(props) {
        super(props)
        this.state = { loginMode: true }
    }
    changeMode() {
        this.setState({ loginMode: !this.state.loginMode })
    }
    onSubmit(values) {
        const { login, signup } = this.props
        this.state.loginMode ? login(values) : signup(values)
    }
    render() {
        const { loginMode } = this.state
        const { handleSubmit } = this.props

        const loginForm = (
            <form onSubmit={handleSubmit(v => this.onSubmit(v))}>
                <Field component={Input} type="text" name="login"
                    placeholder="Login" icon='envelope' />
                <Field component={Input} type="password" name="password"
                    placeholder="Senha" icon='lock' />
                
               {/*  <a href='#' className='pull-right password-reset-link' 
                onClick={e => {
                    toastr.warning('Mudar a senha', 'Por favor, entre em contato com ' + process.env.REACT_APP_ORGANIZATION + ' para criar uma nova senha provisória!')
                    return false
                }}>

                    <i className="fas fa-edit"></i> 
                    Esqueci minha senha
                </a> */}

                <button type="submit" className="col-4 btn btn-warning btn-block">Entrar</button>
            </form>
        )

        const selectProfile = (
            <ul className='list-group custom-list-group'>
                {this.props.profiles.map(profile => (
                    <a key={profile.id} href="#!" className=' text-center col-xs-12'
                    onClick={() => this.props.selectProfile(profile, this.props.token)}>
                        <li className='list-group-item col-xs-12'>
                            <b>{profile.noun}</b>
                        </li>
                    </a>
                ))}
            </ul>
        )

        return (
            <div className="login-page">
                <div className="login-box">
                    <div className="card bg-primary rounded-xg">
                        <div className="card-header">
                            { process.env.REACT_APP_LOGIN_LOGO === undefined || process.env.REACT_APP_LOGIN_LOGO === "" ?
                                    <div className="login-logo">
                                        <h4>{process.env.REACT_APP_NAME}</h4>
                                        <h5>Sistema de Monitoramento do Maranhão</h5>
                                        </div> :
                                    <div className="login-logo">
                                        <img className="image-logo" alt="logo" src={process.env.REACT_APP_LOGIN_LOGO} />
                                    </div>
                            }

                        </div>
                        <div className="card-body login-card-body col-xs-12">
                            {this.props.profiles.length > 1 &&
                                <p className="login-box-msg"> Selecione um perfil</p>
                            }
                            {this.props.profiles.length > 1 ? selectProfile : loginForm}
                            <Messages />
                        </div>
                    </div>
                   
                    <small className='copyright'>Copyright © 2024. Desenvolvido pela Gestão de Sistemas - SEPLAN</small>
                </div>
            </div>
        )
    }
}
Auth = reduxForm({ form: 'authForm' })(Auth)
const mapStateToProps = state => ({
    profiles: state.auth.profiles,
    profile: state.auth.profile,
    token: state.auth.token
})
const mapDispatchToProps = dispatch => bindActionCreators({ login, signup, selectProfile }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Auth)