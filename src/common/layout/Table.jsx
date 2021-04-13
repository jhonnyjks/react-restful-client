import React, { Component } from 'react'
import LabelAndInput from '../form/LabelAndInput';
import If from '../operator/If'
import Row from './row'

export default class Table extends Component {

    state = { width: 0, height: 0 };

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight, search: '' });
    };
    componentDidMount() {
        this.updateDimensions()
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    handleChangeSearch = e => {
        this.setState({ search: e.target.value})
        this.props.generalSearch(e.target.value)
    }

    getBody(){
        return this.props.paginate ? this.props.body.data : this.props.body
    }
    
    renderHead = () => {

        if(this.props.renderHead === false) return null
        
        let b = this.getBody()
        if (b !== undefined && b.length > 0) {
            let head = {}

            if (this.props.attributes) {
                head = this.props.attributes
            } else {
                const bodyAttrs = Object.getOwnPropertyNames(b[0])
                bodyAttrs.forEach((val, index) => head[val] = val )
            }

            return <thead>
                <tr>
                    {(
                        Object.getOwnPropertyNames(head).map((val, index) => {
                            return <th key={index}>{head[val].title || head[val]}</th>
                        })
                    )}

                    {this.props.actions && <th></th>}
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
                        let tr = []

                        if (this.props.attributes) {
                            tr = Object.keys(this.props.attributes)
                        } else {
                            tr = Object.keys(ntr)
                        }

                        return <tr key={tr.id || index}>
                            {
                                tr.map((val, index) => {
                                    let n = ntr
                                    let isObj = false

                                    val.split('.').forEach((i) => {
                                        n = n[i] || ''
                                    })

                                    if (this.props.translate && this.props.translate[val] !== undefined) {
                                        let name_value = this.props.translate[val].filter(e => e.id === ntr[val])[0]
                                        n = name_value ? name_value.name : ntr[val]
                                    }

                                    // Se 'n' for um objeto, puxa o atributo de texto do objeto, para ter informações amigáveis
                                    if(n && n.id) {
                                        isObj = true
                                        // Se houver callback no atributo, call back o callback
                                        if(this.props.attributes[val] && this.props.attributes[val].callback) {
                                            n = this.props.attributes[val].callback(n, body[index])
                                        } else {
                                            n = n.name || n.title || n.description || Object.values(n)[1]
                                            if(n.length > 32) n = n.slice(0, 31) + '...' 
                                        }
                                    }

                                    // Se 'attributes' estiver setado, e se o atributo atual estiver no array setado, exibe a coluna.
                                    if (this.props.attributes) {
                                        // Se houver callback no atributo, call back o callback
                                        if(this.props.attributes[val]) {
                                            if(!isObj && this.props.attributes[val].callback) {
                                                return <td key={index}>{this.props.attributes[val].callback(n, body[index])}</td>
                                            } 
                                            return <td key={index}>{n}</td>
                                        } else {
                                            return null;
                                        }
                                    }

                                    return <th key={index}>{n}</th>
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

                                    {Object.keys(this.props.actions).map((vv, ii) => {
                                        if(vv != 'update' && vv != 'remove') {

                                            if(this.props.actions[vv].className) {
                                            return <button key={ii} className={this.props.actions[vv].className} onClick={(e) => this.props.actions[vv].onClick(ntr, e)}>
                                                <i className={this.props.actions[vv].icon}></i>
                                            </button>
                                            } else {
                                                    return this.props.actions[vv](ntr)
                                            }
                                        }
                                    })}
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
                            let val = ntr
                            
                            if(val[this.props.labelMobile] && val[this.props.labelMobile].id) val = val[this.props.labelMobile]
                            
                            return <div className="card" key={index}>
                                <button className="btn btn-link" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                        
                                <div className="card-header" id={`heading${index}`}>
                                    <h5 className="mb-0">
                                            <strong>{val[this.props.labelMobile] || val["name"] || val["title"] || val["id"] || val["description"] }</strong>
                                        
                                    </h5>
                                </div>
                                </button>

                                <div id={`collapse${index}`} className="collapse" aria-labelledby={`heading${index}`} data-parent="#accordion">
                                    <div className="card-body ml-4 mr-4">
                                        {
                                            body.map((key, index) => {
                                                let n = val
                                                let isObj = false

                                                key.split('.').forEach((i) => {
                                                    n = n[i]
                                                })
            
                                                if (this.props.translate && this.props.translate[key] !== undefined) {
                                                    let name_value = this.props.translate[key].filter(e => e.id === ntr[key])[0]
                                                    n = name_value ? name_value.name : ntr[key]
                                                }

                                                // Se 'n' for um objeto, puxa o atributo de texto do objeto, para ter informações amigáveis
                                                if(n && n.id) {
                                                    isObj = true
                                                    // Se houver callback no atributo, call back o callback
                                                    if(this.props.attributes[key] && this.props.attributes[key].callback) {
                                                        n = this.props.attributes[key].callback(n)
                                                    } else {
                                                        n = n.name || n.title|| n.description || Object.keys(n)[1]
                                                        if(n.length > 32) n = n.slice(0, 31) + '...' 
                                                    }
                                                }

                                                // Se 'attributes' estiver setado, e se o atributo atual estiver no array setado, exibe a coluna.
                                                if (this.props.attributes) {
                                                    // Se houver callback no atributo, call back o callback
                                                    if(this.props.attributes[key]) {
                                                        if(!isObj && this.props.attributes[key].callback) {
                                                            return <div key={index}>
                                                                    <div className="row" key={index}>
                                                                        <strong>{this.props.attributes[key].title || this.props.attributes[key]}</strong> : {this.props.attributes[key].callback(n)}
                                                                    </div>
                                                                </div>
                                                        } 
                                                        return <div key={index}>
                                                        <div className="row" key={index}>
                                                            <strong>{this.props.attributes[key].title || this.props.attributes[key]}</strong> : {n}
                                                        </div>
                                                    </div>
                                                    } else {
                                                        return null;
                                                    }
                                                }
                                            })
                                        }
                                    </div>
                                    <div className="card-footer text-center">
                                        {this.props.actions &&
                                            <div>
                                                {this.props.actions.update && <button className='btn btn-warning col-5' onClick={() => this.props.actions.update(val)}>
                                                    <i className='fa fa-edit'></i> Editar
                                                </button>
                                                }
                                                {this.props.actions.remove && <button className='btn btn-danger col-5' onClick={() => this.props.actions.remove(val)}>
                                                    <i className='fa fa-trash'></i> Excluir
                                                </button>
                                                }

                                                {Object.keys(this.props.actions).map((vv, ii) => {
                                                    if(vv != 'update' && vv != 'remove') {

                                                    return <button style={{marginTop:'10px'}} key={ii} className={this.props.actions[vv].className} onClick={() => this.props.actions[vv].onClick(val)}>
                                                        <i className={this.props.actions[vv].icon}></i> {this.props.actions[vv].label}
                                                    </button>
                                                    }
                                                })}
                               
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
                    { this.props.generalSearch && 
                        <LabelAndInput forceToShow={true} type="text" cols='12 12' placeholder='PESQUISAR' readOnly={false}
                            input={{ onChange: this.handleChangeSearch, value: this.state.search}} grid={{style:{paddingTop:'15px'}}} />
                    }
                    <div id="accordion">
                        {this.renderBodyAccordion()}
                    </div>
                </If>
                <If test={this.state.width > 600}>
                    <div className='box material-item' style={{ paddingBottom: '3px' }}>
                        <If test={this.props.title}>
                            <div className='box-header'>
                                <h4 className='box-title' style={{paddingTop: '1rem', textAlign: 'center'}}>{this.props.title}</h4>
                                <hr/>
                            </div>
                        </If>
                        <div className='box-body no-padding'>
                            <If test={this.props.headComponent}>
                                {this.props.headComponent}
                            </If>

                            { this.props.generalSearch && 
                                <LabelAndInput forceToShow={true} type="text" cols='12 6 4' placeholder='PESQUISAR' readOnly={false}
                                    input={{ onChange: this.handleChangeSearch, value: this.state.search}} grid={{style:{paddingTop:'15px'}}} />
                            }

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