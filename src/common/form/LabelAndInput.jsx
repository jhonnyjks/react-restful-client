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

    render() {
console.log(this.props.readOnly)
        // const permission = this.props.scopes[this.props.meta.form];
        const scope = _.findKey(this.props.scopes, ['entity', _.upperFirst(this.props.meta.form.split('Form')[0])])
        const permission = this.props.scopes[scope] ? this.props.scopes[scope].actions[this.props.input.name] || 0 : 0

        return (
            <>
            { (this.props.readOnly === false || this.hasPermission(permission, 'read')) && <Grid cols={this.props.cols}>
                <div className='form-group'>
                    { this.props.label && <label htmlFor={this.props.name}>{this.props.label}</label> }
                    <InputMask mask={this.props.mask} name={this.props.name} {...this.props.input} 
                        className={`form-control ${this.state.error.flag === true ? `is-invalid` : ``}`}
                        placeholder={this.props.placeholder}
                        disabled={this.props.readOnly !== false ? this.props.readOnly || !this.hasPermission(permission, ['insert', 'update']) : false}
                        type={this.props.type} />
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
export default connect(mapStateToProps, null)(LabelAndInput)