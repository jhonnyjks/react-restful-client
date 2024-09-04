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

    async authenticateGovBr() {
        console.log('Autenticando com gov.br...');

        // Defina seus parâmetros aqui
        const response_type = 'code';
        const client_id = 'SEU_CLIENT_ID'; // Substitua pelo seu CLIENT_ID
        const scope = 'openid+email+profile+govbr_confiabilidades';
        const redirect_uri = encodeURIComponent('https://local.minha_aplicacao.gov.br/callback'); // Substitua pela sua URI de retorno
        const nonce = this.generateRandomString(12); // Valor aleatório para nonce
        const state = this.generateRandomString(12); // Valor aleatório para state

        // Gere o code_verifier e code_challenge
        const code_verifier = this.generateRandomString(64);
        const code_challenge = await this.generateCodeChallenge(code_verifier); // Aguarda a geração do code_challenge

        const code_challenge_method = 'S256';

        // Construa a URL de autenticação
        const authUrl = `https://sso.staging.acesso.gov.br/authorize?response_type=${response_type}&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&nonce=${nonce}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}`;

        // Redireciona o usuário para a URL de autenticação
        window.location.href = authUrl;
    }

    // Função para gerar um código aleatório para o code_verifier e nonce/state
    generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Função para gerar o code_challenge a partir do code_verifier
    async generateCodeChallenge(code_verifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(code_verifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data); // Gera o hash SHA-256 de maneira assíncrona
        const base64Url = btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, ''); // Converte para Base64 URL-safe
        return base64Url;
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
                <label className={loginMode || resetMode?'d-none':''}>Nome</label>
                <Field component={Input} type="input" name="name"
                    placeholder="Digite seu nome"  hide={loginMode || resetMode} />
                <label className={resetMode?'d-none':''}>Usuário</label>
                <Field component={Input} type="text" name="login"
                    placeholder="Digite seu login" hide={resetMode} />
                {resetMode ? null : (
                    <a href='#' className='pull-right' 
                        onClick={e => {
                            e.preventDefault();
                            this.changeResetMode();
                        }}>
                        Esqueceu a senha?
                    </a>
                )}
                <label className={resetMode?'d-none':''}>Senha</label>
                <Field component={Input} type="password" name="password"
                    placeholder="Digite a sua senha"  hide={resetMode} />

                <label className={loginMode || resetMode?'d-none':''}>Confirmar Senha</label>
                <Field component={Input} type="password" name="confirm_password"
                    placeholder="Confirmar Senha"  hide={loginMode || resetMode} />

                {resetMode && (
                    <>
                        <label>Login ou email</label>

                        <Field component={Input} type="text" name="login"
                            placeholder="Informe Login ou email"  />
                    </>
                )}
                
                

                {loginMode && !signupMode && !resetMode && (
                        <button type="submit" className="btn btn-primary btn-block">
                            Entrar
                        </button>
                )}

                {loginMode && !signupMode && !resetMode && (
                    <a href="#!" className="btn btn-gov btn-block" onClick={() => this.authenticateGovBr()}>
                        <span className='text-white'>Entrar com <strong className='text-white'>gov.br</strong></span>
                    </a>
                )}

                {signupMode && !loginMode && !resetMode && (
                        <button type="submit" className="btn btn-primary btn-block">
                            Criar
                        </button>
                )}

                {resetMode && !loginMode && !signupMode && !resetHidenButton && (
                    
                        <button type="submit" className="btn btn-primary btn-block">
                            Redefinir
                        </button>
                )}

                <div className="social-auth-links text-center mb-3">
                    <p>- OU -</p>

                    {loginMode && !signupMode && !resetMode && (
                        <a href="#!" className="btn btn-block btn-outline-primary" onClick={() => this.changeSignupMode()}>
                            Novo usuário? Registrar aqui!
                        </a>
                    )}

                    {signupMode && !loginMode && !resetMode && (
                        <a href="#!" className="btn btn-block btn-outline-primary" onClick={() => this.changeLoginMode()}>
                            Já é cadastrado? Entrar aqui!
                        </a>
                    )}

                    {resetMode && !loginMode && !signupMode && (
                        <a href="#!" className="btn btn-block btn-outline-primary" onClick={() => this.changeLoginMode()}>
                            Já é cadastrado? Entrar aqui!
                        </a>
                    )}
                </div>
            </form>
        )

        const selectProfile = (
            <ul className='list-group custom-list-group'>
                {this.props.profiles.map(profile => (
                    <a key={profile.id} href="#!" className=' btn btn-block btn-primary'
                        onClick={() => this.props.selectProfile(profile, this.props.token)}>
                            {profile.noun}
                    </a>
                ))}
            </ul>
        )

        return (
            <div>
                <div className='bloco-azul'></div>
                <div className="login-page">
                    <div className="login-box container">{
                        process.env.REACT_APP_LOGIN_LOGO === undefined || process.env.REACT_APP_LOGIN_LOGO === "" ?
                        <div className="login-logo"><b>{process.env.REACT_APP_NAME}</b></div> :
                            <div className="login-logo">
                                <img className="image-logo" alt="logo" src={process.env.REACT_APP_LOGIN_LOGO} />
                            </div>
                    }
                        <div className="card">
                            <div className="card-body login-card-body rounded-lg col-xs-12">
                                <h2 className="login-box-msg"> 
                                    <strong>
                                        {this.props.profiles.length > 1 ? 'Selecione um perfil' : (resetMode ? 'Redefinir Senha' : (loginMode ? 'Bem vindo!' : 'Crie sua conta'))}
                                    </strong>
                                </h2>
                                {resetMode ? loginForm : (this.props.profiles.length > 1 ? selectProfile : loginForm)}
                            </div>
                            <Messages />
                        </div>
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
