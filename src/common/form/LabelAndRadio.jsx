import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Grid from '../layout/grid'

class LabelAndRadio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: {
                message: null,
                flag: false
            },
            selectedOption: false
        }

        this.onValueChange = this.onValueChange.bind(this);
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

    onValueChange(event) {

        this.setState({
          selectedOption: event.target.value
        });
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

        // console.log(this.props.input.name, this.props.label);

        // if (this.state.error.flag === true) {
        //     console.log(this.state.error.message.replace(this.props.input.name, this.props.label));

        // console.log(this.state.error.message);

        //     console.log(this.state.error.message.replace(
        //         new RegExp(this.props.input.name.replace(/_/g, ' '), 'i'),
        //         this.props.label
        //     ));
            
        // }

        return (
            <>
            { (this.props.readOnly === false || this.hasPermission(permission, 'read') || this.props.forceToShow) && <Grid cols={this.props.cols} style={this.props.style || {}} className={this.props.className || {}} >
                <div className='form-group'> 
                        {this.props.options && this.props.options[0] && this.props.options.map(
                            e => (
                                e && e.id > -1 ? (
                                    <div key={e.id} className='form-check'>
                                        <input
                                            type="radio"
                                            value={e.id}
                                            checked={this.state.selectedOption === e.id}
                                            onChange={this.onValueChange}
                                            style={{ marginRight: '5px' }}
                                            className='form-check-input'
                                        /> 
                                        <label  htmlFor={this.props.name} style={{ fontWeight: 'normal'}} className='form-check-label'>
                                            {this.props.label}

                                            { (this.props.callback ? this.props.callback(e) : null) || e[this.props.textAttr] || e.name || e.noun || e.title || e.description || e.id }
                                        </label>
                                    </div>
                                ) : <></>
                            )
                        )}
                        
                        {/* for test and validation */}                       
                        {/* <div key={1} style={{ marginBottom: '-10px' }}> 
                                <label   style={{ fontWeight: 'normal'}} className='radio'>{"   seleciona aqui 1   "}                                    <input
                                        type="radio"
                                        value={"teste"}
                                        checked={this.state.selectedOption === "teste"}
                                        onChange={this.onValueChange}
                                        style={{ marginRight: '5px' }}
                                    /> 
                                  
                                </label>

                                <label   style={{ fontWeight: 'normal'}} className='radio'>{"   seleciona aqui 2   "} 
                                <input
                                        type="radio"
                                        value={"teste2"}
                                        checked={this.state.selectedOption === "teste2"}
                                        onChange={this.onValueChange}
                                        style={{ marginRight: '5px' }}
                                    /> 
                                  
                                </label>
                        </div> */}

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
export default connect(mapStateToProps, null)(LabelAndRadio)