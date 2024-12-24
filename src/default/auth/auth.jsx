import React, { Component,useRef  } from 'react'
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

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');
        const validateToken = urlParams.get('validate_token')

        if (userId && validateToken) {

            let values = {
                id: userId,
                hash: validateToken,
            }

            this.props.login(values, 'verified-email')
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
                .then(res => {
                    if(res.status == 200){
                        this.changeLoginMode()
                    }
                })
        }
    }

    render() {
        const { loginMode, signupMode, resetMode, resetHidenButton } = this.state
        const { handleSubmit } = this.props

        const loginInput = document.querySelector('input[name="login"]');
        const passwordInput = document.querySelector('input[name="password"]');

        if(loginInput){
            loginInput.addEventListener('keydown', (event) => {
            // Verifica se a tecla TAB foi pressionada
                if (event.key === "Tab") {
                    event.preventDefault(); // Impede o comportamento padrão do TAB
                    passwordInput.focus(); // Move o foco para o input de senha
                }
            });
        }

        const loginForm = (
            <form onSubmit={handleSubmit(v => this.onSubmit(v))}>
                <label className={loginMode || resetMode?'d-none':''}>Nome</label>
                <Field component={Input} type="input" name="name"
                    placeholder="Digite seu nome"  hide={loginMode || resetMode} />
                <label className={loginMode || resetMode?'d-none':''}>Email</label>
                <Field component={Input} type="input" name="email"
                    placeholder="Digite seu email"  hide={loginMode || resetMode} />
                <label className={resetMode?'d-none':''}>Usuário</label>
                <Field component={Input} type="text" name="login"
                    placeholder="Digite seu login" hide={resetMode}/>
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
            <div className="">
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
