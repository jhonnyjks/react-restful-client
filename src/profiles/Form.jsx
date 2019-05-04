import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'

import LabelAndInput from '../common/form/LabelAndInput'
import PermissionList from './permissions/List'
import { init } from './actions'

class Form extends Component {
    render() {
        return (
            <form role='form' onSubmit={this.props.handleSubmit}>
                <div className='box-body'>
                    <Field name='noun' component={LabelAndInput} readOnly={this.props.readOnly}
                    label='Nome' cols='12 6' placeholder='Informe o nome' />
                    <Field name='description' component={LabelAndInput} readOnly={this.props.readOnly}
                    label='Descrição' cols='12 6' placeholder='Descreva o perfil' />
                    <PermissionList profileId={this.props.id} />
                </div>
                <div className='box-footer'>
                    <button type='submit' className={`btn btn-${this.props.submitClass}`}>{this.props.submitLabel}</button>
                    <button type='button' className='btn btn-default' onClick={this.props.init}>Cancelar</button>
                </div>
            </form>
        )
    }
}

Form = reduxForm({form: 'profileForm', destroyOnUnmount: false})(Form)
const selector = formValueSelector('profileForm')
const mapStateToProps = state => ({
    id: selector(state, 'id'),
    noun: selector(state, 'noun'),
    description: selector(state, 'description')
})
const mapDispatchToProps = dispatch => bindActionCreators({init}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)