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

        this.state = { password: '', new_password: '' }
    }

    changePassword = () => {
    
        axios.post(`${process.env.REACT_APP_API_HOST}/auth/change-password`, 
            { password: this.state.password, new_password: this.state.new_password })
        .then(resp => {
            toastr.success('Sucesso', resp.data.message)
            
            this.props.history.push("/dashboard");
        })
        .catch(e => {
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

    handleChangePassword = e => {
        this.setState({password: e.target.value})
    }

    handleChangeNewPassword = e => {
        this.setState({new_password: e.target.value})
    }

    render() {
        return (
            <div>
                <ContentHeader title='Alterar senha' small='' />
                <Content>
                    <form>
                        <div className='box-body'>
                            <LabelAndInput name='password' type="password"
                                label='Senha Atual' cols='12 6' placeholder='*****'
                                input={{ onChange: this.handleChangePassword, value: this.state.password }} />
                            <LabelAndInput name='new_password' type="password"
                                label='Nova Senha' cols='12 6' placeholder='*****'
                                input={{ onChange: this.handleChangeNewPassword, value: this.state.new_password }}/>
                        </div>
                        <div className='box-footer'>
                            <button type='button' className={`btn btn-primary`} onClick={this.changePassword}>Salvar</button>
                            <button type='button' className='btn btn-default' onClick={this.props.init}>Cancelar</button>
                        </div>
                    </form>
                </Content>
            </div>
        )
    }
}

export default withRouter(ChangePassword);