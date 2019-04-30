import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, remove, selectPermission } from './actions'
import If from '../../common/operator/If'

class List extends Component {

    componentWillMount() {
        this.props.getList();
    }

    renderAttributes(list = []) {
        return list.map(item => (
            <div key={item} className='col-xs-12'>
                <div className='col-xs-4'>
                    {item}
                </div>
                <div className='col-xs-2'>
                    <input className='center-block' type="checkbox" value="" />
                </div>
                <div className='col-xs-2'>
                    <input className='center-block' type="checkbox" value="" />
                </div>
                <div className='col-xs-2'>
                    <input className='center-block' type="checkbox" value="" />
                </div>
                <div className='col-xs-2'>
                    <input className='center-block' type="checkbox" value="" />
                </div>

            </div>
        ))
    }

    renderRows() {
        const list = this.props.list || []

        return list.map(item => (
            <li key={item.route} className='list-group-item col-xs-12'>
                <a className='row col-xs-12' onClick={() => this.props.selectPermission(item.route === this.props.selected.route ? {} : item)}>
                    <b>{item.route}</b>
                </a>
                <If test={item.route === this.props.selected.route}>
                    <div className='col-xs-12'>
                        <b className='tex-center col-xs-4'>Atributo</b>
                        <b className='tex-center col-xs-2'>Adicionar</b>
                        <b className='tex-center col-xs-2'>Visualizar</b>
                        <b className='tex-center col-xs-2'>Editar</b>
                        <b className='tex-center col-xs-2'>Remover</b>
                        {this.renderAttributes(item.attributes)}
                    </div>
                </If>
            </li>
        ))
    }

    render() {
        return (
            <div className='col-xs-12'>
                <div className='panel panel-default'>
                    <div className='panel-heading text-center'><b>Permissões</b></div>
                    <ul className='list-group custom-list-group'>
                        {this.renderRows()}
                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ list: state.permission.list, selected: state.permission.selected })
const mapDispatchToProps = dispatch => bindActionCreators({ getList, showUpdate, remove, selectPermission }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)