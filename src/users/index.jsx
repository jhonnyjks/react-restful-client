import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import List from './billingCycleList'
import { create, update, remove, init } from './billingCycleActions'

class BillingCycle extends Component {

    componentWillMount() {
        this.props.init()
    }

    render() {
        return (
            <div>
                <ContentHeader title='Usuários' />
                <Content>
                    <List />
                </Content>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    create, update, remove, init
}, dispatch)
export default connect(null, mapDispatchToProps)(BillingCycle)