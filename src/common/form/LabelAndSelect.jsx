import React, { Component } from 'react'
import Select from 'react-select';
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

    // handleSelectChange = (selectedOptions) => {
    //     // Supondo que `input.onChange` espera um array de valores
    //     const values = selectedOptions.map(option => option.value);
    //     this.props.input.onChange(values);
    // }
    handleSelectChange = (selectedOptions) => {
        if (Array.isArray(selectedOptions)) {
            // Para múltiplas seleções, extrai os valores dos objetos selecionados
            const values = selectedOptions.map(option => option.value);
            this.props.input.onChange(values);
        } else if (selectedOptions) {
            // Para uma única seleção, extrai o valor do objeto selecionado
            this.props.input.onChange(selectedOptions.value);
        } else {
            // Caso nenhuma opção seja selecionada
            this.props.input.onChange(null);
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
  
    render() {
        const formName = this.props.meta ? this.props.meta.form : null;
        const isMulti = this.props.isMulti || false;
        let scope = '';
        let permission = 0;
        let rules = [];
        let action = null;

        if (formName) {
            scope = _.findKey(this.props.scopes, ['entity', _.upperFirst(formName.split('Form')[0])]);
            permission = this.props.scopes[scope] ? this.props.scopes[scope].actions[this.props.input.name] || 0 : 0;
            rules = this.getValidation(scope);
            action = this.props.forms[formName] && this.props.forms[formName].values && this.props.forms[formName].values.id ? 'update' : 'insert';
        }

        const selectedValues = Array.isArray(this.props.input.value) ? this.props.input.value : [this.props.input.value];
       
        // const selectedOptions = this.props.options.filter(option =>
        //     selectedValues.includes(option.id || option.value)
        // ).map(option => ({
        //     value: option.id || option.value,
        //     label: option[this.props.textAttr] || option.name || option.noun || option.title || option.description || option.id
        // }));
        const selectedOptions = this.props.options.filter(option =>
            Array.isArray(this.props.input.value) 
                ? this.props.input.value.includes(option.id || option.value)
                : this.props.input.value === (option.id || option.value)
        ).map(option => ({
            value: option.id || option.value,
            label: option[this.props.textAttr] || option.name || option.noun || option.title || option.description || option.id
        }));

        const selectStyles = isMulti ? {} : { menu: base => ({ ...base, zIndex: 9999 }) };
        const selectClassName = `basic-single-select ${this.state.error.flag === true ? `is-invalid` : ``}`;

        return (
            <>
                {(this.props.readOnly === false || this.hasPermission(permission, 'read') || this.props.forceToShow) && <Grid cols={this.props.cols} style={this.props.style || {}} className={this.props.className || {}}>
                    <div className='form-group'>
                        <label htmlFor={this.props.name}>{this.props.label}</label>

                        <Select
                            isMulti={isMulti}
                            name={this.props.input.name}
                            options={this.props.options.map(option => ({
                                value: option.id || option.value,
                                label: option[this.props.textAttr] || option.name || option.noun || option.title || option.description || option.id
                            }))}
                            className={selectClassName}
                            classNamePrefix="select"
                            styles={selectStyles}
                            required={rules['required'] || false}
                            onChange={this.handleSelectChange}
                            value={isMulti ? selectedOptions : selectedOptions[0]} // Ajuste aqui para suportar seleção única
                        />

                        <div className="invalid-feedback">
                            {this.state.error.flag && (this.state.error.message.replace(this.props.input.name, this.props.label))}
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
export default connect(mapStateToProps, null)(LabelAndSelect)