import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { getList, showUpdate, selectPermission, changeAttribute } from './actions'
import If from '../../../common/operator/If'
import CheckBox from '../../../common/form/CheckBox'
import Grid from '../../../common/layout/grid'

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
            <div key={`${item.noun}-${item.code}`} className='row col-xs-12 col-md-12'>
                <Grid cols='4 4 4'>
                    {item.noun}
                </Grid>
                <Grid cols='2 2 2'>
                    <CheckBox
                        value="1"
                        checked={codesPerOpetarion[1].indexOf(item.code) > -1}
                        handleChange={event => this.props.changeAttribute(event, item, this.props.list[this.props.selected], 'atributo')}
                    />
                </Grid>
                <Grid cols='2 2 2'>
                    <CheckBox
                        value="2"
                        checked={codesPerOpetarion[2].indexOf(item.code) > -1}
                        handleChange={event => this.props.changeAttribute(event, item, this.props.list[this.props.selected], 'atributo')}
                    />
                </Grid>
                <Grid cols='2 2 2'>
                    <CheckBox
                        value="4"
                        checked={codesPerOpetarion[4].indexOf(item.code) > -1}
                        handleChange={event => this.props.changeAttribute(event, item, this.props.list[this.props.selected], 'atributo')}
                    />
                </Grid>
                <Grid cols='2 2 2'>
                    <CheckBox
                        value="8"
                        checked={codesPerOpetarion[8].indexOf(list[0].code) > -1}
                        handleChange={event => this.props.changeAttribute(event, list[0], this.props.list[this.props.selected], 'atributo')}
                    />
                </Grid>
            </div>
        ))
    }

    renderScopes(scopes = []) {
        return scopes.map(scope => (
            <div key={`${scope.noun}-${scope.code}`} className='row col-xs-12 col-md-12'>
                <Grid cols='4 4 4'>
                    {scope.noun}
                </Grid>
                <Grid cols='2 2 2'>
                    <CheckBox
                        value="1"
                        checked={codesPerOpetarion[1].indexOf(scope.code) > -1}
                        handleChange={event => this.props.changeAttribute(event, scope, this.props.list[this.props.selected], 'scope')}
                    />
                </Grid>
                <Grid cols='2 2 2'>
                    <CheckBox
                        value="2"
                        checked={codesPerOpetarion[2].indexOf(scope.code) > -1}
                        handleChange={event => this.props.changeAttribute(event, scope, this.props.list[this.props.selected], 'scope')}
                    />
                </Grid>
                <Grid cols='2 2 2'>
                    <CheckBox
                        value="4"
                        checked={codesPerOpetarion[4].indexOf(scope.code) > -1}
                        handleChange={event => this.props.changeAttribute(event, scope, this.props.list[this.props.selected], 'scope')} 
                    />
                </Grid>
                <Grid cols='2 2 2'>
                    <CheckBox
                        value="8"
                        checked={codesPerOpetarion[8].indexOf(scopes[0].code) > -1}
                        handleChange={event => this.props.changeAttribute(event, scopes[0], this.props.list[this.props.selected], 'scope')}
                    />
                </Grid>
            </div>
        ))
    }

    renderRows() {
        const list = this.props.list || []

        return list.map((item, index) => (
            <li key={`${item.cpath}-${index}`} className='list-group-item col-xs-12'>
                <a href="#!" className='row col-xs-12' onClick={(e) => this.props.selectPermission(e, index)}>
                    <b>{item.cpath}</b>
                </a>
                <If test={index === this.props.selected}>
                    <Tabs
                        defaultActiveKey="atributo"
                        id="permissoes-atributos-scopes"
                    >
                        <Tab eventKey="atributo" title="Atributo" className='bg-white'>
                            <div className='row col-xs-12 col-md-12'>
                                <b className='tex-center col-xs-4 col-md-4'></b>
                                <b className='tex-center col-xs-2 col-md-2'>Visualizar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Adicionar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Editar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Remover</b>
                            </div>
                            {this.renderAttributes(item.actions)}
                        </Tab>
                        <Tab eventKey="scopes" title="Scopes" className='bg-white'>
                            <div className='row col-xs-12 col-md-12'>
                                <b className='tex-center col-xs-4 col-md-4'></b>
                                <b className='tex-center col-xs-2 col-md-2'>Visualizar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Adicionar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Editar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Remover</b>
                            </div>
                            {this.renderScopes(item.scopes)}
                        </Tab>
                    </Tabs>
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
    selectPermission,
    changeAttribute
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)