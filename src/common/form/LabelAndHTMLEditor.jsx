import React, { Component } from 'react'
//import { Editor } from '@tinymce/tinymce-react'
import { change } from "redux-form"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import Grid from '../layout/grid'


class LabelAndHTMLEditor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            error: {
                message: null,
                flag: false
            }
        }
    }

    componentWillUpdate(nextProps) {
        const { error } = this.state;
        const nextError = nextProps.error || {}; // Garante que nextError seja um objeto
    
        if (error.flag === false) {
            if (Object.keys(nextError).length > 0 && nextError[this.props.input.name]) {
                this.setState({
                    error: {
                        message: nextError[this.props.input.name][0],
                        flag: true
                    }
                });
            }
        } else {
            if (Object.keys(nextError).length === 0 || nextError[this.props.input.name] === undefined) {
                this.setState({
                    error: {
                        message: null,
                        flag: false
                    }
                });
            }
        }
    }

    handleEditorChange = (content, editor) => {
        this.props.change(this.props.meta.form, this.props.input.name, content)
    }

    render() {
        return (
            <Grid cols={this.props.cols}>
                <div className='form-group'>
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                    <div className="invalid-feedback">
                        {this.state.error.flag === true ? this.state.error.message : "Campo inválido"}
                    </div>
                    <ReactQuill
                        theme="snow"
                        value={this.props.input.value}
                        onChange={this.handleEditorChange} 
                        readOnly={this.props.readOnly}
                        defaultValue={this.props.defaultValue}
                        placeholder={this.props.placeholder}
                    />
                </div>
            </Grid>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({change}, dispatch);
}

export default connect(null, mapDispatchToProps)(LabelAndHTMLEditor)
