import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../common/template/ContentHeader'
import Content from '../../common/template/Content'
import If from '../../common/operator/If'
import List from './List'
import Form from './Form'
import { getList, showContent, update, init, create } from './actions'

class Profile extends Component {

    componentWillMount() {
        this.props.init()
        this.props.getList()
    }

    render() {
        return (
            <div>
                <ContentHeader title='Perfis' small='Gerenciar perfis de usuário'
                    createMethod={() => this.props.showContent('form')} />
                <Content>
                    <If test={this.props.show === 'list'}>
                        <List />
                    </If>
                    <If test={this.props.show === 'form'}>
                        <Form onSubmit={this.props.isEdit ? this.props.update : this.props.create}
                            submitLabel='Salvar' submitClass='primary' />
                    </If>
                </Content>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    show: state.profile.show,
    isEdit: state.form.profileForm && state.form.profileForm.initial && state.form.profileForm.initial.id > 0
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getList, showContent, update, init, create
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Profile)