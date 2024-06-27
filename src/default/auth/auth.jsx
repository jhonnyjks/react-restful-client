import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toastr } from 'react-redux-toastr'

import './auth.css'
import { login, selectProfile } from './authActions'
import Row from '../../common/layout/row'
// import Grid from '../../common/layout/grid'
import Messages from '../../common/msg/Message'
import Input from '../../common/form/InputAuth'

class Auth extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            loginMode: true, 
            signupMode: false,
            resetMode: false,
            resetHidenButton: false, 
        }
    }

    changeLoginMode() {
        this.setState({ loginMode: true, signupMode: false, resetMode: false })
    }

    changeSignupMode() {
        this.setState({ loginMode: false, signupMode: true, resetMode: false })
    }

    changeResetMode() {
        this.setState({ loginMode: false, signupMode: false, resetMode: true })
    }
 
    onSubmit(values) {
        const { login, signup } = this.props
        if (this.state.resetMode) {

            if (!values.login) {
                toastr.warning("Atenção", 'Necessário preencher o campo de login.');
                return;
            }

            this.setState({ resetHidenButton: true })

            login(values, 'reset')
        } else if (this.state.loginMode) {
            login(values, 'login')
        } else {
            login(values, 'signup')
        }
    }

    render() {
        const { loginMode, signupMode, resetMode, resetHidenButton } = this.state
        const { handleSubmit } = this.props

        const loginForm = (
            <form onSubmit={handleSubmit(v => this.onSubmit(v))}>
                <Field component={Input} type="input" name="name"
                    placeholder="Nome" icon='user' hide={loginMode || resetMode} />
                <Field component={Input} type="text" name="login"
                    placeholder="Login" icon='envelope' hide={resetMode} />
                <Field component={Input} type="password" name="password"
                    placeholder="Senha" icon='lock' hide={resetMode} />
                <Field component={Input} type="password" name="confirm_password"
                    placeholder="Confirmar Senha" icon='lock' hide={loginMode || resetMode} />

                {resetMode && (
                    <Field component={Input} type="text" name="login"
                        placeholder="Informe Login ou email" icon='envelope' />
                )}
                
                {resetMode ? null : (
                    <a href='#' className='pull-right' 
                        onClick={e => {
                            e.preventDefault();
                            this.changeResetMode();
                        }}>
                        Esqueci minha senha
                    </a>
                )}

                {loginMode && !signupMode && !resetMode && (
                    <div className="col-4">
                        <button type="submit" className="btn btn-primary btn-block">
                            Entrar
                        </button>
                    </div>
                )}

                {signupMode && !loginMode && !resetMode && (
                    <div className="col-4">
                        <button type="submit" className="btn btn-primary btn-block">
                            Criar
                        </button>
                    </div>
                )}

                {resetMode && !loginMode && !signupMode && !resetHidenButton && (
                    <div className="col-4">
                        <button type="submit" className="btn btn-primary btn-block">
                            Redefinir
                        </button>
                    </div>
                )}

                <div className="social-auth-links text-center mb-3">
                    <p>- OU -</p>

                    {loginMode && !signupMode && !resetMode && (
                        <a href="#!" className="btn btn-block btn-primary" onClick={() => this.changeSignupMode()}>
                            Novo usuário? Registrar aqui!
                        </a>
                    )}

                    {signupMode && !loginMode && !resetMode && (
                        <a href="#!" className="btn btn-block btn-primary" onClick={() => this.changeLoginMode()}>
                            Já é cadastrado? Entrar aqui!
                        </a>
                    )}

                    {resetMode && !loginMode && !signupMode && (
                        <a href="#!" className="btn btn-block btn-primary" onClick={() => this.changeLoginMode()}>
                            Já é cadastrado? Entrar aqui!
                        </a>
                    )}
                </div>
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
                <div className="login-box">{
                    process.env.REACT_APP_LOGIN_LOGO === undefined || process.env.REACT_APP_LOGIN_LOGO === "" ?
                        <div className="login-logo"><b>{process.env.REACT_APP_NAME}</b></div> :
                        <div className="login-logo">
                            <img className="image-logo" alt="logo" src={process.env.REACT_APP_LOGIN_LOGO} />
                        </div>
                }
                    <div className="card">
                        <div className="card-body login-card-body col-xs-12">
                            <p className="login-box-msg"> {this.props.profiles.length > 1 ? 'Selecione um perfil' : (resetMode ? 'Redefinir Senha' : (loginMode ? 'Bem vindo!' : 'Crie sua conta'))}</p>
                            {resetMode ? loginForm : (this.props.profiles.length > 1 ? selectProfile : loginForm)}
                        </div>
                        <Messages />
                    </div>
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
const mapDispatchToProps = dispatch => bindActionCreators({ login, selectProfile }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Auth)
