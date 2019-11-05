import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import './auth.css'
import { login, signup, selectProfile } from './authActions'
import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import Messages from '../common/msg/Message'
import Input from '../common/form/InputAuth'

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
                    <Grid cols="4">
                        <button type="submit"
                            className="btn btn-primary btn-block btn-flat">
                            {loginMode ? 'Entrar' : 'Registrar'}
                        </button>
                    </Grid>
                    <Grid cols="12 7" className="col-sm-offset-1">
                        <a href="!#" onClick={() => this.changeMode()}>
                            {loginMode ? 'Novo usuário? Registrar aqui!' :
                                'Já é cadastrado? Entrar aqui!'}
                        </a>
                    </Grid>
                </Row>
            </form>
        )

        const selectProfile = (
            <ul className='list-group custom-list-group'>
                { this.props.profiles.map(profile => (
                    <li key={profile.id} className='list-group-item col-xs-12'>
                        <a href="!#" className=' text-center col-xs-12'
                        onClick={() => this.props.selectProfile(profile, this.props.token)}>
                            <b>{profile.noun}</b>
                        </a>
                    </li>
                )) }
            </ul>
        )

        return (
            <div className="login-box">
                <div className="login-logo"><b>{process.env.REACT_APP_NAME}</b></div>
                <div className="login-box-body col-xs-12">
                    <h4 className="login-box-msg">{this.props.profiles.length === 1 ? 'Bem vindo!' : 'Selecione um perfil'}</h4>
                    {this.props.profiles.length > 1 ? selectProfile : loginForm}
                </div>
                <Messages />
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