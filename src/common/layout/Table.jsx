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

    getBody(){
        return this.props.paginate ? this.props.body.data : this.props.body
    }
    
    renderHead = () => {
        let b = this.getBody()
        if (b !== undefined && b.length > 0) {
            let head = Object.getOwnPropertyNames(b[0])
            return <thead>
                <tr>
                    {(
                        head.map((val, index) => {
                            if (this.props.attributes) {
                                if(this.props.attributes[val]) {
                                    return <th key={index}>{ this.props.attributes[val].title || this.props.attributes[val]}</th>
                                } else {
                                    return null
                                }
                            }

                            return <th key={index}>{val}</th>
                        })
                    )}

                    {this.props.actions && <th>Ações</th>}
                </tr>
            </thead>
        }
    }

    renderBody = () => {
        let body = this.getBody()
        if (body) {
            return <tbody>
                {
                    body.map((ntr, index) => {
                        let tr = Object.keys(ntr)
                        return <tr key={tr.id || index}>
                            {
                                tr.map((val, index) => {
                                    let n = ntr[val]

                                    if (this.props.translate && this.props.translate[val] !== undefined) {
                                        let name_value = this.props.translate[val].filter(e => e.id === ntr[val])[0]
                                        n = name_value ? name_value.name : ntr[val]
                                    }

                                    // Se 'n' for um objeto, puxa o atributo de texto do objeto, para ter informações amigáveis
                                    if(n && n.id) {

                                        // Se houver callback no atributo, call back o callback
                                        if(this.props.attributes[val].callback) {
                                            n = this.props.attributes[val].callback(n)
                                        } else {
                                            n = n.name || n.title || Object.values(n)[1]
                                            if(n.length > 64) n = n.slice(0, 63) + '...' 
                                        }
                                    }

                                    // Se 'attributes' estiver setado, e se o atributo atual estiver no array setado, exibe a coluna.
                                    if (this.props.attributes) {
                                        return this.props.attributes[val] ? <td key={index}>{n}</td> : null
                                    } else {
                                        return <th key={index}>{n}</th>
                                    }
                                })
                            }
                            {this.props.actions &&
                                <td>
                                    {this.props.actions.update && 
                                        <button type='button' className='btn btn-warning' onClick={() => this.props.actions.update(ntr)}>
                                            <i className='fa fa-edit'></i>
                                        </button>
                                    }
                                    {this.props.actions.remove && 
                                        <button type='button' className='btn btn-danger' onClick={() => this.props.actions.remove(ntr)}>
                                            <i className='fa fa-trash'></i>
                                        </button>
                                    }
                                </td>
                            }
                        </tr>
                    })
                }
            </tbody>
        }
    }

    renderBodyAccordion = () => {
        let bodyAccordion = this.getBody()
        if (bodyAccordion) {
            return (
                <React.Fragment>
                    {
                        bodyAccordion.map((ntr, index) => {
                            let body = Object.keys(ntr)
                            return <div className="card" key={index}>
                                <div className="card-header" id={`heading${index}`}>
                                    <h5 className="mb-0">
                                        <button className="btn btn-link" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                            <strong>{ntr[this.props.labelMobile] || ntr["name"] || "p"}</strong>
                                        </button>
                                    </h5>
                                </div>

                                <div id={`collapse${index}`} className="collapse" aria-labelledby={`heading${index}`} data-parent="#accordion">
                                    <div className="card-body ml-4 mr-4">
                                        {
                                            body.map((key, index) => {
                                                let n = ntr[key]

                                                // Se 'n' for um objeto, puxa o atributo de texto do objeto, para ter informações amigáveis
                                                if(n && n.id) {
                                                    n = n.name || n.title || Object.values(n)[1]
                                                    if(n.length > 64) n = n.slice(0, 63) + '...' 
                                                }

                                                if (this.props.attributes) {
                                                    return this.props.attributes[key] ? <div key={index}>
                                                        <div className="row" key={index}>
                                                            <strong>{this.props.attributes[key].title || this.props.attributes[key]}</strong> : {n}
                                                        </div>
                                                    </div> : null
                                                } else {
                                                    return <div key={index}>
                                                        <div className="row" key={index}>
                                                            <strong>{key}</strong> : {n}
                                                        </div>
                                                    </div>
                                                }
                                            })
                                        }
                                    </div>
                                    <div className="card-footer text-center">
                                        {this.props.actions &&
                                            <div>
                                                <button className='btn btn-warning col-5' onClick={() => this.props.actions.update(ntr)}>
                                                    <i className='fa fa-edit'></i> Editar
                                                </button>
                                                <button className='btn btn-danger col-5' onClick={() => this.props.actions.remove(ntr)}>
                                                    <i className='fa fa-trash'></i> Excluir
                                                </button>
                                            </div>
                                        }
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
                            </table>
                        </div>
                    </div>
                </If>
            </React.Fragment>
        )
    }
}