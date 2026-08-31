import React, { Component } from 'react'
import Grid from '../layout/grid'
import InputMask from 'react-input-mask'
import { connect } from 'react-redux'
import _ from 'lodash'

class LabelAndInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: {
                message: null,
                flag: false
            }
        }
    }

    componentWillUpdate(nextProps) {
        if (this.state.error.flag === false) {
            if (nextProps.error && Object.keys(nextProps.error).length > 0 && this.props.input && nextProps.error[this.props.input.name]) {
                this.setState({
                    error: {
                        message: nextProps.error[this.props.input.name][0],
                        flag: true
                    }
                })
            }
        } else {
            if (Object.keys(nextProps.error).length === 0 || (this.props.input && nextProps.error[this.props.input.name] === undefined)) {
                this.setState({
                    error: {
                        message: null,
                        flag: false
                    }
                })
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

    getValidation = (scope) => {
        let rules = []
        if(this.props.scopes[scope] && this.props.scopes[scope].rules 
            && this.props.scopes[scope].rules[this.props.input.name]) {
            const splitRules = this.props.scopes[scope].rules[this.props.input.name].split('|')

            splitRules.forEach(rule => {

                if(rule.indexOf(':') > -1) {
                    const ruleValue = rule.split(':')
                    rules[ruleValue[0]] = ruleValue[1]
                } else {
                    rules[rule] = true
                }
            })
        }

        return rules
            
    }

    render() {
        const formName = this.props.meta ? this.props.meta.form : null
        let scope = ''
        let permission = 0
        let rules = []
        let action = null

        if(formName) {
            scope = _.findKey(this.props.scopes, ['entity', _.upperFirst(formName.split('Form')[0])])
            permission = this.props.scopes[scope] ? this.props.scopes[scope].actions[this.props.input.name] || 0 : 0
            rules = this.getValidation(scope)
            action = this.props.forms[formName] && this.props.forms[formName].values && this.props.forms[formName].values.id ? 'update' : 'insert'
        }

        return (
            <>
            { (this.props.readOnly === false || this.hasPermission(permission, 'read') || this.props.forceToShow) && <Grid cols={this.props.cols} {...this.props.grid}>
                <div className='form-group'>
                    { this.props.label && <label htmlFor={this.props.name}>{this.props.label}</label> }
                    <textarea name={this.props.name} {...this.props.input} 
                        className={`form-control ${this.state.error.flag === true ? `is-invalid` : ``}`}
                        placeholder={this.props.placeholder}
                        disabled={this.props.readOnly !== false ? this.props.readOnly || !this.hasPermission(permission, action) : false}
                        maxLength={this.props.maxLength}
                        required={rules['required'] || false} ></textarea>
                    <div className="invalid-feedback">
                        {
                            this.state.error.flag === true ?
                            (
                                this.props.input.name.includes('_') ?
                                this.state.error.message.replace(new RegExp(this.props.input.name.replace(/_/g, ' '), 'i'), this.props.label) :
                                this.state.error.message.replace(this.props.input.name, this.props.label)
                            ) :
                            "Valor inválido informado"
                        }
                    </div>
                </div>
            </Grid>}
            </>
        )
    }
}

const mapStateToProps = state => ({ 
    scopes: state.auth.profile.scopes,
    forms: state.form
 })
export default connect(mapStateToProps, null)(LabelAndInput)