import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'

import Row from '../../common/layout/row'
import { init, getList, remove } from './userProfile.duck'
import LabelAndSelect from '../../common/form/LabelAndSelect'
import If from '../../common/operator/If'
import Table from '../../common/layout/Table'
import Content from '../../common/template/Content'

class FormUserProfile extends Component {
    constructor(props) {
        super(props);
   
        this.onSubmit = this.onSubmit.bind(this)

        this.state = { profiles: [], filteredProfiles: [] }
    }

    componentWillMount() {
        if (this.props.parentId !== null) {
            this.props.getList(this.props.parentId)
            this.getProfiles()
        }
    }

    componentDidUpdate() {
        let filteredProfiles = [...this.state.profiles]

        // Removendo do select os studantes que já estão na lista de presença
        this.props.list.forEach(file => { 
            _.pullAllBy(filteredProfiles, [{'id': file.profile_id}], 'id')
        })

        if(!_.isEqual(filteredProfiles, this.state.filteredProfiles)) this.setState({filteredProfiles})
    }

    onSubmit(userProfile) {
        userProfile.user_id = this.props.parentId
        this.props.onCreate(userProfile)
    }

    getProfiles = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/profiles`)
        .then(resp => {
            this.setState({ profiles: resp.data.data })
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

    renderTableHead = () => {
       return <Row style={{marginBottom: '-2rem', paddingLeft: '1rem'}}>               
            <Field name='profile_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                cols='12 6' placeholder=' - Selecione o perfil - '
                options={this.state.filteredProfiles} error={this.props.errors} />
            <button type='submit' className={`btn btn-${this.props.submitClass}`} style={{height: 'min-content'}}>
                {this.props.submitLabel}
            </button>
        </Row>
    }    

    render() {
        return (
            <If test={this.props.parentShow == 'form' && this.props.parentId}>
                <Content>
                    <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <Table title='PERFIS' body={this.props.list} headComponent={this.renderTableHead()}
                        actions={{ remove: this.props.remove }} attributes={{profile:'Perfil'}} renderHead={false} />
                    </form>
                </Content>
            </If>
        );
    }
}

FormUserProfile = reduxForm({ form: 'userProfileForm', destroyOnUnmount: false })(FormUserProfile)
const selector = formValueSelector('userProfileForm')
const mapStateToProps = state => ({
    profile_id: selector(state, 'profile_id'),
    parentId: state.form.userForm.values.id,
    errors: state.userProfile.errors,
    list: state.userProfile.list,
    parentShow: state.user.show
})
const mapDispatchToProps = dispatch => bindActionCreators({ 
    init, getList, remove }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(FormUserProfile)