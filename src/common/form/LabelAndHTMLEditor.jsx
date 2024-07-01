import React, { Component } from "react";
import { change } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import JoditEditor from "jodit-react";

import Grid from "../layout/grid";

class LabelAndHTMLEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {
        message: null,
        flag: false,
        hrmlContent: this.props.input.value
      },
    };
  }

  componentWillUpdate(nextProps) {
    const { error } = this.state;
    const nextError = nextProps.error || {}; // Garante que nextError seja um objeto

    if (error.flag === false) {
      if (
        Object.keys(nextError).length > 0 &&
        nextError[this.props.input.name]
      ) {
        this.setState({
          error: {
            message: nextError[this.props.input.name][0],
            flag: true,
          },
        });
      }
    } else {
      if (
        Object.keys(nextError).length === 0 ||
        nextError[this.props.input.name] === undefined
      ) {
        this.setState({
          error: {
            message: null,
            flag: false,
          },
        });
      }
    }
  }

  handleEditorChange = (content) => {
    this.props.change(this.props.meta.form, this.props.input.name, content);
  };

  render() {
    return (
      <Grid cols={this.props.cols}>
        <div className="form-group">
          <label htmlFor={this.props.name}>{this.props.label}</label>
          <div className="invalid-feedback">
            {this.state.error.flag === true
              ? this.state.error.message
              : "Campo inválido"}
          </div>
          <JoditEditor
            name={this.props.input?.name || this.props.name}
            value={this.props.input.value || this.props.defaultValue || ''}
            config={{
                readonly: this.props.readOnly, // all options from https://xdsoft.net/jodit/docs/,
                placeholder: this.props.placeholder || 'Crie aqui seu conteúdo...'
            }}
            tabIndex={1} // tabIndex of textarea

            // preferred to use only theh onBlur option to update the content for performance reasons
            onBlur={v => {
                this.handleEditorChange(v)
            }} 
            //onChange={(newContent) => this.setState({htmlContent: newContent})}
          />
    
        </div>
      </Grid>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ change }, dispatch);
};

export default connect(null, mapDispatchToProps)(LabelAndHTMLEditor);
