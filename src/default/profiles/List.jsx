import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, remove } from './actions'
import Table from '../../common/layout/Table';

class List extends Component {

    componentWillMount() {
        this.props.getList();
    }

    render() {
        return (
            <Table
                body={this.props.list}
                actions={{update: true, remove:this.props.remove}}
                pagination={this.props.pagination}
                attributesSearch={this.props.getList}
                attributes={{noun: 'Nome', description: 'Descrição'}}
            />
        )
    }
}

const mapStateToProps = state => ({ 
    list: state.profile.list,
    pagination: state.profile.pagination
})
const mapDispatchToProps = dispatch => bindActionCreators({ getList, showUpdate, remove }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)
