import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, remove, selectPermission, changeAttribute } from './actions'
import If from '../../common/operator/If'

// Mapeando permissões específicas
const codesPerOpetarion = {
    1: [1, 3, 5, 7, 9, 11, 13, 15], //1-Read
    2: [2, 3, 6, 7, 10, 11, 14, 15], //2-Insert
    4: [4, 5, 6, 7, 12, 13, 14, 15], //4-Update
    8: [8, 9, 10, 11, 12, 13, 14, 15] //8-Delete
}

class List extends Component {

    componentWillMount() {
        this.props.getList(this.props.profileId);
    }

    renderAttributes(list = []) {
        return list.map(item => (
            <div key={item.noun} className='col-xs-12'>
                <div className='col-xs-4'>
                    {item.noun}
                </div>
                <div className='col-xs-2'>
                    <input className='center-block' type="checkbox" value="1"
                        checked={this.props.list[0].actions[1].code} 
                        onChange={event => this.props.changeAttribute(event, item)} />
                </div>
                <div className='col-xs-2'>
                    <input className='center-block' type="checkbox" value="2"
                        checked={codesPerOpetarion[2].indexOf(item.code) > -1} 
                        onChange={event => this.props.changeAttribute(event, item)} />
                </div>
                <div className='col-xs-2'>
                    <input className='center-block' type="checkbox" value="4"
                        checked={codesPerOpetarion[4].indexOf(item.code) > -1} 
                        onChange={event => this.props.changeAttribute(event, item)} />
                </div>
                <div className='col-xs-2'>
                    <input className='center-block' type="checkbox" value="8"
                        checked={codesPerOpetarion[8].indexOf(item.code) > -1} 
                        onChange={event => this.props.changeAttribute(event, item)} />
                </div>

            </div>
        ))
    }

    renderRows() {
        const list = this.props.list || []

        return list.map((item, index) => (
            <li key={item.cpath} className='list-group-item col-xs-12'>
                <a className='row col-xs-12' onClick={() => this.props.selectPermission(index)}>
                    <b>{item.cpath}</b>
                </a>
                <If test={index === this.props.selected}>
                    <div className='col-xs-12'>
                        <b className='tex-center col-xs-4'>Atributo</b>
                        <b className='tex-center col-xs-2'>Visualizar</b>
                        <b className='tex-center col-xs-2'>Adicionar</b>
                        <b className='tex-center col-xs-2'>Editar</b>
                        <b className='tex-center col-xs-2'>Remover</b>
                        {this.renderAttributes(item.actions)}
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
const mapDispatchToProps = dispatch => bindActionCreators({
    getList,
    showUpdate,
    remove,
    selectPermission,
    changeAttribute
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)