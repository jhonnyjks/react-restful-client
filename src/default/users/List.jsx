import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, remove } from './actions'

class List extends Component {

    componentWillMount() {
        this.props.getList();
    }

    renderRows() {
        const list = this.props.list || []

        return list.map(user => (
            <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.login}</td>
                <td>{user.user_type_id}</td>
                <td>{user.user_situation_id}</td>
                <td>
                    <button className='btn btn-warning' onClick={() => this.props.showUpdate(user)}>
                        <i className='fa fa-pencil'></i>
                    </button>
                    <button className='btn btn-danger' onClick={() => this.props.remove(user)}>
                        <i className='fa fa-trash-o'></i>
                    </button>
                </td>
            </tr>
        ))
    }

    render() {
        return (
            <div className='box material-item' style={{ paddingBottom: '3px' }}>
                <div className='box-body no-padding table-responsive'>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Login</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th className='table-actions'>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ list: state.user.list })
const mapDispatchToProps = dispatch => bindActionCreators({ getList, showUpdate, remove }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)