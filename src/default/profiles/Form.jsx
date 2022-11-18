import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Row from '../../common/layout/row'
import LabelAndInput from '../../common/form/LabelAndInput'
import PermissionList from './permissions/List'
import { init } from './actions'
import BackButton from '../../common/form/BackButton'
import SubmitButton from '../../common/form/SubmitButton'

class Form extends Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Gerenciar perfil de usuário</h3>
                    </div>
                    <div className='card-body'>
                        <Row>
                            <Field name='noun' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Nome' cols='12 6' placeholder='Informe o nome' error={this.props.errors} />
                            <Field name='description' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Descrição' cols='12 6' placeholder='Descreva o perfil' error={this.props.errors} />
                        </Row>
                        {this.props.parentId && <PermissionList profileId={this.props.id} /> }
                    </div>
                    <div className='card-footer'>
                        <SubmitButton label='Salvar' />
                        <BackButton label='Cancelar' />
                    </div>
                </div>
            </form>
        )
    }
}

Form = reduxForm({ form: 'profileForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('profileForm')
const mapStateToProps = state => ({
    id: selector(state, 'id'),
    noun: selector(state, 'noun'),
    description: selector(state, 'description'),
    errors: state.profile.errors,
    parentId: state.form.profileForm && state.form.profileForm.values ? state.form.profileForm.values.id : null,
})
const mapDispatchToProps = dispatch => bindActionCreators({ init }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)