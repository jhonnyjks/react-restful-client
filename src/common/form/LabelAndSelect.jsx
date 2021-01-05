import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Grid from '../layout/grid'

class LabelAndSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: {
                message: null,
                flag: false
            }
        }
    }

    hasPermission = (permission, method) => {
        // Mapeando as permissões aos métodos
        const permissionToMethods = [
            {},
            {read: true},
            {insert: true},
            {read: true, insert: true},
            {update: true},
            {read: true,update: true},
            {insert: true,update: true},
            {read: true,insert: true,update: true},
            {delete:true},
            {read: true,delete:true},
            {insert: true,delete:true},
            {read: true,insert: true,delete:true},
            {update: true,delete:true},
            {read: true,update: true,delete:true},
            {insert: true,update: true,delete:true},
            {read: true,insert: true,update: true,delete:true}
        ]

        if(permission < 0 || permission > 15) return false

        if(Array.isArray(method)) {
            let result = false
            method.forEach((val) => {
                result = !result ? permissionToMethods[permission][val] || false : true
            })

            return result
        } else {
            return  permissionToMethods[permission][method] || false
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.error) {      
            if (this.state.error.flag === false) {
                if (Object.keys(nextProps.error).length > 0 && nextProps.error[this.props.input.name]) {
                    this.setState({
                        error: {
                            message: nextProps.error[this.props.input.name][0],
                            flag: true
                        }
                    })
                }
            } else {
                if (Object.keys(nextProps.error).length === 0 || nextProps.error[this.props.input.name] === undefined) {
                    this.setState({
                        error: {
                            message: null,
                            flag: false
                        }
                    })
                }
            }
        }
    }

    render() {
        let scope = '' 
        if(this.props.meta) scope = _.findKey(this.props.scopes, ['entity', _.upperFirst(this.props.meta.form.split('Form')[0])])
        const permission = this.props.scopes[scope] ? this.props.scopes[scope].actions[this.props.input.name] || 0 : 0

        return (
            <>
            { (this.props.readOnly === false || this.hasPermission(permission, 'read') || this.props.forceToShow) && <Grid cols={this.props.cols}>
                <div className='form-group'>
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                    <select name={this.props.name} {...this.props.input}
                        disabled={this.props.readOnly !== false ? this.props.readOnly || !this.hasPermission(permission, ['insert', 'update']) : false}
                        className={`custom-select mb-3 ${this.state.error.flag === true ? `is-invalid` : ``}`}>
                        <option value="">{this.props.placeholder}</option>
                        {this.props.options && this.props.options[0] && this.props.options.map(
                            e => ((e && e.id) ? (<option key={e.id} value={e.id}>
                                    { (this.props.callback ? this.props.callback(e) : null) || e[this.props.textAttr] || e.name || e.noun || e.title || e.description || e.id }
                                </option>) : <></>)
                        )}
                    </select>
                    <div className="invalid-feedback">
                        {this.state.error.flag === true ? this.state.error.message : "Campo inválido"}
                    </div>
                </div>
            </Grid>}
            </>
        )
    }
}

const mapStateToProps = state => ({ scopes: state.auth.profile.scopes })
export default connect(mapStateToProps, null)(LabelAndSelect)