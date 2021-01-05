import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

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
                <Field component={Input} type="input" name="name"
                    placeholder="Nome" icon='user' hide={loginMode} />
                <Field component={Input} type="text" name="login"
                    placeholder="Login" icon='envelope' />
                <Field component={Input} type="password" name="password"
                    placeholder="Senha" icon='lock' />
                <Field component={Input} type="password" name="confirm_password"
                    placeholder="Confirmar Senha" icon='lock' hide={loginMode} />
                <Row>
                    <div className="col-4">
                        <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                    </div>
                </Row>
                <div className="social-auth-links text-center mb-3">
                    <p>- OU -</p>
                    <a href="#!" className="btn btn-block btn-primary" onClick={() => this.changeMode()}>
                        {loginMode ? 'Novo usuário? Registrar aqui!' :
                            'Já é cadastrado? Entrar aqui!'}
                    </a>
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
                            <p className="login-box-msg">{this.props.profiles.length === 1 ? 'Bem vindo!' : 'Selecione um perfil'}</p>
                            {this.props.profiles.length > 1 ? selectProfile : loginForm}
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
const mapDispatchToProps = dispatch => bindActionCreators({ login, signup, selectProfile }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Auth)