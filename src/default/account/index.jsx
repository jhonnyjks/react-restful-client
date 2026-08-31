import React, { Component } from 'react'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { withRouter } from "react-router-dom";

import ContentHeader from '../../common/template/ContentHeader'
import Content from '../../common/template/Content'
import LabelAndInput from '../../common/form/LabelAndInput'

class ChangePassword extends Component {

    constructor(props) {
        super(props)

        this.state = { user: { name: '', email: '', celphone: '', login: '' } }
    }

    componentWillMount() {
        axios.get(`${process.env.REACT_APP_API_HOST}/auth/user`)
        .then(resp => {
             this.setState({user: resp.data})
        }).catch(e => {
            if (!e.response) {
                toastr.error('Erro', 'Desconhecido :-/')
                console.log(e)
            } else if (!e.response.data) {
                toastr.error('Erro', e.response.message)
            } else if (e.response.data.errors) {
                Object.entries(e.response.data.errors).forEach(
                    ([key, error]) => toastr.error(key, error[0]))
            } else if (e.response.data) {
                toastr.error('Erro', e.response.data.message)
            }
        })
    }

    changeUserData = () => {
        const { user } = this.state

        axios.post(`${process.env.REACT_APP_API_HOST}/auth/change-user-data`, 
            { name: user.name, email: user.email, celphone: user.celphone, login: user.login })
        .then(resp => {
            toastr.success('Sucesso', resp.data.message)
            
            this.props.history.push("/dashboard");
        }).catch(e => {
            if (!e.response) {
                toastr.error('Erro', 'Desconhecido :-/')
                console.log(e)
            } else if (!e.response.data) {
                toastr.error('Erro', e.response.message)
            } else if (e.response.data.errors) {
                Object.entries(e.response.data.errors).forEach(
                    ([key, error]) => toastr.error(key, error[0]))
            } else if (e.response.data) {
                toastr.error('Erro', e.response.data.message)
            }
        })
    
    }

    handleChangeName = e => {
        this.setState({ user: {...this.state.user, name: e.target.value}})
    }

    handleChangeEmail = e => {
        this.setState({ user: {...this.state.user, email: e.target.value}})
    }

    handleChangeCelphone = e => {
        this.setState({ user: {...this.state.user, celphone: e.target.value}})
    }

    handleChangeLogin = e => {
        this.setState({ user: {...this.state.user, login: e.target.value}})
    }

    render() {
        const { user } = this.state
        return (
            <div>
                <ContentHeader title='Meus dados' small='Mantenha-os atualizados' />
                <Content>
                    <form>
                        <div className='box-body'>
                            <LabelAndInput name='name' type="text"
                                label='Nome' cols='12 6' placeholder='Informe seu nome'
                                input={{ onChange: this.handleChangeName, value: user.name }} />
                            <LabelAndInput name='email' type="email"
                                label='Email' cols='12 6' placeholder='Informe seu email'
                                input={{ onChange: this.handleChangeEmail, value: user.email }} />
                            <LabelAndInput name='celphone' type="number" min="10000000000" max="99999999999"
                                label='Celular' cols='12 6' placeholder='Celular no formato 98988776655'
                                input={{ onChange: this.handleChangeCelphone, value: user.celphone }} />
                            <LabelAndInput name='login' type="text"
                                label='Login' cols='12 6' placeholder='login necessário para conectar'
                                input={{ onChange: this.handleChangeLogin, value: user.login }} />
                        </div>
                        <div className='box-footer'>
                            <button type='button' className={`btn btn-primary`} onClick={this.changeUserData}>Salvar</button>
                            <button type='button' className='btn btn-default' onClick={this.props.init}>Cancelar</button>
                        </div>
                    </form>
                </Content>
            </div>
        )
    }
}

export default withRouter(ChangePassword);