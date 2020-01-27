import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'

import Row from '../../common/layout/row'
import LabelAndInput from '../../common/form/LabelAndInput'
import LabelAndSelect from '../../common/form/LabelAndSelect'
import { init } from './actions'

class Form extends Component {
    constructor(props) {
        super(props)
        this.state = { generalStatuses: [] }
    }

    componentWillMount() {
        this.getGeneralStatuses()
    }

    getGeneralStatuses = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/general_statuses`)
        .then(resp => {
            this.setState({ generalStatuses: resp.data.data })
        })
        .catch(e => {
            if (!e.response) {
                toastr.error('Erro', 'Desconhecido :-/')
                console.log(e)
            } else if (!e.response.data) {
                toastr.error('Erro', e.response.message)
            } else if (e.response.data) {
                toastr.error('Erro', e.response.data.message)
            }
        })
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Gerenciar Usuário</h3>
                    </div>
                    <div className='card-body'>
                        <Row>
                            <Field name='name' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Nome' cols='12 4' placeholder='Informe o nome' error={this.props.errors} />
                            <Field name='email' component={LabelAndInput} readOnly={this.props.readOnly}
                                type='email' label='E-mail' cols='12 4' placeholder='seu.email@mail.com' error={this.props.errors} />
                            <Field name='login' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Login' cols='12 4' placeholder='Informe o login' error={this.props.errors} />
                        </Row>
                        <Row>
                            <Field name='password' component={LabelAndInput} type="password" readOnly={this.props.readOnly}
                                label='Senha' cols='12 4' placeholder='Informe a senha' error={this.props.errors} />
                            <Field name='general_status_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                                label='Status' cols='12 4' placeholder=' - Selecione - ' 
                                options={this.state.generalStatuses} error={this.props.errors} />
                        </Row>
                    </div>
                    <div className='card-footer'>
                        <button type='submit' className={`btn btn-${this.props.submitClass}`}>{this.props.submitLabel}</button>
                        <button type='button' className='btn btn-default' onClick={this.props.init}>Cancelar</button>
                    </div>
                </div>
            </form>
        )
    }
}

Form = reduxForm({ form: 'userForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('userForm')
const mapStateToProps = state => ({
    name: selector(state, 'name'),
    email: selector(state, 'email'),
    login: selector(state, 'login'),
    password: selector(state, 'password'),
    general_status_id: selector(state, 'general_status_id'),
    errors: state.user.errors
})
const mapDispatchToProps = dispatch => bindActionCreators({ init }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)