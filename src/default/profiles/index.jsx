import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'

import ContentHeader from '../../common/template/ContentHeader'
import Content from '../../common/template/Content'
import If from '../../common/operator/If'
import List from './List'
import Form from './Form'
import { getList, showContent, update, init, create, showUpdate } from './actions'
import Auth from '../auth/auth'

class Profile extends Component {

      //Necessário para gerar o contexto em this.context
      static contextTypes = {
        router: () => null, // replace with PropTypes.object if you use them
    }




  
    

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
               
               <If test={this.context.router.route.location.pathname != "/trocar-perfil"}>
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
               </If>
                
                <If test={this.context.router.route.location.pathname == "/trocar-perfil"}>
                        <Auth></Auth>                
                </If>    
            </div>
        )
    }
}

const mapStateToProps = state => ({
    show: state.profile.show,
    isEdit: state.form.profileForm && state.form.profileForm.initial && state.form.profileForm.initial.id > 0,
    list: state.profile.list
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getList, showContent, update, init, create, showUpdate
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Profile)