import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'

import ContentHeader from '../../common/template/ContentHeader'
import Content from '../../common/template/Content'
import If from '../../common/operator/If'
import List from './List'
import Form from './Form'
import FormUserProfile from './FormUserProfile'
import { getList, showContent, update, init, create, showUpdate } from './actions'
import { create as createUserProfile } from './userProfile.duck'

class User extends Component {

    componentWillMount() {
        this.props.init()
        this.props.getList()
    }

    render() {
        if(this.props.match.params.id) {
            const intervalId = setInterval( () => {
                if(this.props.list.length > 0) {
                    clearInterval(intervalId)
                    const item = _.find(this.props.list, ['id', Number.parseInt(this.props.match.params.id)])
                    this.props.showUpdate(item)
                }
            } , 300)
        }
        
        return (
            <div>
                <ContentHeader title='Usuários' small='Gerenciar usuários'
                    createMethod={() => this.props.showContent('form')} />
                <Content>
                    <If test={this.props.show === 'list'}>
                        <List />
                    </If>
                    <If test={this.props.show === 'form'}>
                        <Form onSubmit={this.props.isEdit ? this.props.update : this.props.create}
                            submitLabel='Salvar' submitClass='primary' />
                        <FormUserProfile submitLabel='Adicionar' submitClass='primary'
                            onCreate={this.props.createUserProfile} />
                    </If>
                </Content>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    show: state.user.show,
    isEdit: state.form.userForm && state.form.userForm.initial && state.form.userForm.initial.id > 0,
    list: state.user.list
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getList, showContent, update, init, create, showUpdate, createUserProfile
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(User)