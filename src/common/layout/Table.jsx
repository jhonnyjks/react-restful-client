import React, { Component } from 'react'
import If from '../operator/If'

export default class Table extends Component {

    state = { width: 0, height: 0 };

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };
    componentDidMount() {
        this.updateDimensions()
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    renderHead = () => {
        if (this.props.body.length > 1) {
            let head = Object.getOwnPropertyNames(this.props.body[0])
            return <thead>
                <tr>
                    {head.map((val, index) => <th key={index}>{val}</th>)}
                    {this.props.defaultActions === true && <th>Ações</th>}
                </tr>
            </thead>
        }
    }

    renderBody = () => {
        if (this.props.body) {
            return <tbody>
                {
                    this.props.body.map((ntr, index) => {
                        let tr = Object.values(ntr)
                        return <tr key={tr.key || tr.id || index}>
                            {
                                tr.map((val, index) =>
                                    <td key={index}>
                                        {val}
                                    </td>
                                )
                            }
                            {this.props.defaultActions === true &&
                                <td>
                                    <button className='btn btn-warning' onClick={() => this.props.update(ntr)}>
                                        <i className='fa fa-edit'></i>
                                    </button>
                                    <button className='btn btn-danger' onClick={() => this.props.remove(ntr)}>
                                        <i className='fa fa-trash'></i>
                                    </button>
                                </td>
                            }
                        </tr>
                    })
                }
            </tbody>
        }
    }

    renderBodyAccordion = () => {
        if (this.props.body) {
            return (
                <React.Fragment>
                    {
                        this.props.body.map((ntr, index) => {
                            return <div class="card">
                                <div class="card-header" id={`heading${index}`}>
                                    <h5 class="mb-0">
                                        <button class="btn btn-link" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                            {ntr.name || "p"}
                                        </button>
                                    </h5>
                                </div>

                                <div id={`collapse${index}`} class="collapse" aria-labelledby={`heading${index}`} data-parent="#accordion">
                                    <div class="card-body">
                                        Anim pariatur cliche reprehenderit
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </React.Fragment>
            )
        }
    }

    render() {
        return (
            <React.Fragment>
                <If test={this.state.width < 600}>
                    <div id="accordion">
                        {this.renderBodyAccordion()}
                    </div>
                </If>
                <If test={this.state.width > 600}>
                    <div className='box material-item' style={{ paddingBottom: '3px' }}>
                        <If test={this.props.title}>
                            <div className='box-header'>
                                <h3 className='box-title'>{this.props.title}</h3>
                            </div>
                        </If>
                        <div className='box-body no-padding'>
                            <table className='table table-hover'>
                                {this.renderHead()}
                                {this.renderBody()}
                                {this.props.children}
                                {this.state.width}
                            </table>
                        </div>
                    </div>
                </If>
            </React.Fragment>
        )
    }
}