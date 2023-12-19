import React, { Component } from 'react'
import Select from "react-select";
import { Link, withRouter } from "react-router-dom";

import "./react-select-custom.css"
import "./table.css"
import LabelAndInput from '../form/LabelAndInput';
import If from '../operator/If'
import Row from './row'
class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            queryStrSearch: {},
            searchFields: {},
            searchFieldsValues: {},
        };
    }

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
        this.setState({ search: e.target.value })
        this.props.generalSearch(e.target.value)
    }

    doSearch = (e, search, page = null) => {

        let queryStrSearch = this.state.queryStrSearch;
        let searchFields = this.state.searchFields
        let searchFieldsValues = this.state.searchFieldsValues

        if (['text', 'date'].indexOf(search?.type) > -1 && e.target && e.target.value) {
            queryStrSearch[search.field] = search.field + ':' + e.target.value
            searchFieldsValues[search.field] = e.target.value
            searchFields[search.field] = search.field + ':like'
        } else if (e && e.value) {
            queryStrSearch[search.field] = search.field + ':' + e.value
            searchFieldsValues[search.field] = e.value
            searchFields[search.field] = search.field + ':='
        } else {
            // se não tiver valor definido na busca
            // mas a variável estiver preenchida por uma
            // operação passada ela é removida
            if (search && search.field) {
                queryStrSearch.hasOwnProperty(search.field);
                delete queryStrSearch[search.field];
                searchFields.hasOwnProperty(search.field);
                delete searchFields[search.field];
                searchFieldsValues[search.field] = '';
            }
        }

        const queryStr = Object.values(queryStrSearch).join(';') + '&searchFields=' + Object.values(searchFields).join(';')

        // Adiciona ?page=1 quando uma pesquisa é realizada
        const pageQueryParam = page !== null ? `?page=${page}` : '?page=1&'; // REMOVER O '?' E COLOCAR DIRETAMENTE NA URL DO GETLIST

        this.props.attributesSearch(pageQueryParam + '&search=' + queryStr + '&searchJoin=and');
        this.setState({ queryStrSearch, searchFields, searchFieldsValues })
    }

    getBody() {
        return this.props.paginate ? this.props.body.data : this.props.body
    }

    renderHead = () => {

        if (this.props.renderHead === false) return null

        let b = this.getBody()
        let head = {}

        if (this.props.attributes) {
            head = this.props.attributes
        } else if (b.length > 0) {
            const bodyAttrs = Object.getOwnPropertyNames(b[0])
            bodyAttrs.forEach((val, index) => head[val] = val)
        } else {
            return null
        }

        return <thead>
            <tr>
                {(
                    Object.getOwnPropertyNames(head).map((val, index) => {
                        return <th key={index} style={head[val].style || {}}>{head[val].title || head[val]}</th>
                    })
                )}

                {this.props.actions && <th></th>}
            </tr>

            {this.props.attributes && this.renderSearch(head)}
        </thead>
    }

    renderSearch = (head) => {
        let hasSearch = false
        Object.getOwnPropertyNames(head).map((val, index) => {
            if (typeof head[val] == 'object' && head[val].search) hasSearch = true
        })
        return hasSearch && <tr>
            {(

                Object.getOwnPropertyNames(head).map((val, index) => {
                    if (typeof head[val].search == 'object') {
                        const search = head[val].search
                        switch (search.type || '') {
                            case 'text':
                            case 'date':
                                return <th key={index} style={head[val].style || {}}>
                                    <LabelAndInput type={search.type} input={{ onChange: e => this.doSearch(e, search), value: this.state.searchFieldsValues[search.field] }}
                                        forceToShow={true} readOnly={false} style={{ marginBottom: '0px' }} grid={{ style: { marginBottom: '0px' } }} />
                                </th>
                                break;

                            default:
                                return <th key={index} style={head[val].style || {}}>
                                    <Select
                                        isClearable
                                        className="search-select-container"
                                        classNamePrefix="search-select"
                                        onChange={e => this.doSearch(e, search)} options={search.list || []} />

                                </th>
                        }

                    } else {
                        return <th key={index} style={head[val].style || {}}></th>
                    }

                })
            )}

            {this.props.actions && <th></th>}
        </tr>
    }

    renderBody = () => {
        const body = this.getBody()
        const actionsPath = this.props.path || this.props.location.pathname

        if (body) {
            return <tbody>
                {
                    body.map((ntr, ii) => {
                        let tr = []

                        if (this.props.attributes) {
                            tr = Object.keys(this.props.attributes)
                        } else {
                            tr = Object.keys(ntr)
                        }

                        return <tr key={tr.id || ii}>
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
                                    if (n && n.id) {
                                        isObj = true
                                        // Se houver callback no atributo, call back o callback
                                        if (this.props.attributes && this.props.attributes[val] && this.props.attributes[val].callback) {
                                            n = this.props.attributes[val].callback(n, body[ii])
                                        } else {
                                            n = n.name || n.title || n.description || Object.values(n)[1]
                                            if (n.length > 32) n = n.slice(0, 31) + '...'
                                        }
                                    }

                                    // Se 'attributes' estiver setado, e se o atributo atual estiver no array setado, exibe a coluna.
                                    if (this.props.attributes) {
                                        // Se houver callback no atributo, call back o callback
                                        if (this.props.attributes[val]) {
                                            if (!isObj && this.props.attributes[val].callback) {
                                                return <td style={this.props.attributes[val].style} key={index}>{this.props.attributes[val].callback(n, body[ii])}</td>
                                            }
                                            return <td style={this.props.attributes[val].style} key={index} title={n}>{n}</td>
                                        } else {
                                            return null;
                                        }
                                    }

                                    return <th key={index}>{n}</th>
                                })
                            }
                            {this.props.actions &&
                                <td>
                                    {this.props.actions.update === true &&
                                        <Link to={actionsPath + '/' + ntr.id}
                                            style={{ border: '0px', background: 'none', fontSize: '1.2em', color: '#333', ...(this.props.marginLeft && { marginLeft: `${this.props.marginLeft}%` }) }} >
                                            <i className='fa fa-edit'></i>
                                        </Link>
                                    }

                                    {((typeof this.props.actions.update) === 'function') &&
                                        <button type='button' onClick={() => this.props.actions.update(ntr)}
                                            style={{ border: '0px', background: 'none', fontSize: '1.2em', color: '#333', marginLeft: '20px' }} >
                                            <i className='fa fa-edit'></i>
                                        </button>
                                    }

                                    {this.props.actions.remove &&
                                        <button type='button' onClick={() => this.props.actions.remove(ntr)}
                                            style={{ border: '0px', background: 'none', fontSize: '1.2em', color: '#333', marginLeft: '20px' }} >
                                            <i className='fa fa-trash'></i>
                                        </button>
                                    }

                                    {Object.keys(this.props.actions).map((vv, ii) => {
                                        if (vv != 'update' && vv != 'remove' && (!this.props.actions[vv].condition || this.props.actions[vv].condition(ntr))) {

                                            if (typeof this.props.actions[vv] != 'function') {
                                                let style = { border: '0px', background: 'none', fontSize: '1.2em', color: '#333', marginLeft: '20px' }

                                                if (this.props.actions[vv].style) {
                                                    Object.keys(this.props.actions[vv].style).map(key => style[key] = this.props.actions[vv].style[key])
                                                }
                                                
                                                return <button key={ii} className={this.props.actions[vv].className || ''} onClick={(e) => this.props.actions[vv].onClick(ntr, e)}
                                                    style={style}
                                                    title={this.props.actions[vv].title || ''}>
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
        const bodyAccordion = this.getBody()
        const actionsPath = this.props.path || this.props.location.pathname

        if (bodyAccordion) {
            return (
                <React.Fragment>
                    {
                        bodyAccordion.map((ntr, index) => {
                            let body = Object.keys(ntr)
                            let val = ntr

                            if (val[this.props.labelMobile] && val[this.props.labelMobile].id) val = val[this.props.labelMobile]

                            return <div className="card" key={index}>
                                <button className="btn btn-link" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>

                                    <div className="card-header" id={`heading${index}`}>
                                        <h5 className="mb-0">
                                            <strong>{val[this.props.labelMobile] || val["name"] || val["title"] || val["id"] || val["description"]}</strong>

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
                                                if (n && n.id) {
                                                    isObj = true
                                                    // Se houver callback no atributo, call back o callback
                                                    if (this.props.attributes && this.props.attributes[key] && this.props.attributes[key].callback) {
                                                        n = this.props.attributes[key].callback(n, bodyAccordion[index])
                                                    } else {
                                                        n = n.name || n.title || n.description || Object.keys(n)[1]
                                                        if (n.length > 32) n = n.slice(0, 31) + '...'
                                                    }
                                                }

                                                // Se 'attributes' estiver setado, e se o atributo atual estiver no array setado, exibe a coluna.
                                                if (this.props.attributes) {
                                                    // Se houver callback no atributo, call back o callback
                                                    if (this.props.attributes[key]) {
                                                        if (!isObj && this.props.attributes[key].callback) {
                                                            return <div key={index}>
                                                                <div className="row" key={index}>
                                                                    <strong>{this.props.attributes[key].title || this.props.attributes[key]}</strong> : {this.props.attributes[key].callback(n, bodyAccordion[index])}
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
                                                {this.props.actions.update && <Link to={actionsPath + '/' + val.id} className='btn btn-primary col-5' >
                                                    <i className='fa fa-edit'></i> Editar
                                                </Link>
                                                }
                                                {this.props.actions.remove && <button className='btn btn-danger col-5' onClick={() => this.props.actions.remove(val)}>
                                                    <i className='fa fa-trash'></i> Excluir
                                                </button>
                                                }

                                                {Object.keys(this.props.actions).map((vv, ii) => {
                                                    if (vv != 'update' && vv != 'remove' && (!this.props.actions[vv].condition || this.props.actions[vv].condition(val))) {
                                                        let style = { marginTop: '10px' }

                                                        if (this.props.actions[vv].style) {
                                                            Object.keys(this.props.actions[vv].style).map(key => style[key] = this.props.actions[vv].style[key])
                                                        }

                                                        return <button style={style} key={ii} className={this.props.actions[vv].className} onClick={() => this.props.actions[vv].onClick(val)}>
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
    
    renderPagination() {
        const { pagination } = this.props;
      
        if (!pagination || pagination.total === undefined) {
          return null;
        }
      
        const pages = [];
        const totalPages = pagination.last_page;
        const currentPage = pagination.current_page;
        const displayPages = 20; // Exibir 20 páginas por padrão
      
        let startPage = Math.max(1, currentPage - Math.floor(displayPages / 2));
        let endPage = Math.min(totalPages, startPage + displayPages - 1);
      
        // Ajusta o intervalo de páginas se estiver perto do final
        if (endPage === totalPages && startPage > 1) {
          startPage = Math.max(1, endPage - displayPages + 1);
        }
      
        // Adiciona páginas ao redor da página atual
        for (let i = startPage; i <= endPage; i++) {
          pages.push(
            <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
              {i === currentPage ? (
                <span className="page-link">{i}</span>
              ) : (
                <a className="page-link" onClick={() => this.doSearch(null, null, i)}>
                  {i}
                </a>
              )}
            </li>
          );
        }
      
        // Adiciona "três pontinhos" e a última página
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            pages.push(
              <li key="endEllipsis" className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            );
          }
          pages.push(
            <li key={totalPages} className={`page-item ${totalPages === currentPage ? 'active' : ''}`}>
              {totalPages === currentPage ? (
                <span className="page-link">{totalPages}</span>
              ) : (
                <a className="page-link" onClick={() => this.doSearch(null, null, totalPages)}>
                  {totalPages}
                </a>
              )}
            </li>
          );
        }
      
        return (
          <div className="card-footer clearfix">
            <ul className="pagination pagination-sm m-0 float-right mt-3">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <a
                  className="page-link"
                  onClick={() => this.doSearch(null, null, currentPage - 1)}
                  aria-label="Previous"
                >
                  «
                </a>
              </li>
              {pages}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <a
                  className="page-link"
                  onClick={() => this.doSearch(null, null, currentPage + 1)}
                  aria-label="Next"
                >
                  »
                </a>
              </li>
            </ul>
          </div>
        );
    }
    
    render() {
        return (
            <React.Fragment>
                <If test={this.state.width < 600}>
                    {this.props.generalSearch &&
                        <LabelAndInput forceToShow={true} type="text" cols='12 12' placeholder='PESQUISAR' readOnly={false}
                            input={{ onChange: this.handleChangeSearch, value: this.state.search }} grid={{ style: { paddingTop: '15px' } }} />
                    }
                    <div id="accordion">
                        {this.renderBodyAccordion()}
                    </div>
                </If>
                <If test={this.state.width > 600}>
                    <div className='box material-item' style={{ paddingBottom: '3px', width: '100%', marginBottom: '40px' }}>
                        <If test={this.props.title}>
                            <div className='box-header'>
                                <h4 className='box-title' style={{ paddingTop: this.props.renderHead ? '1rem' : '0.5rem', textAlign: 'center' }}>{this.props.title}</h4>
                                {this.props.renderHead && <hr />}
                            </div>
                        </If>
                        <div className='box-body no-padding'>
                            <If test={this.props.headComponent}>
                                {this.props.headComponent}
                            </If>

                            {this.props.generalSearch &&
                                <LabelAndInput forceToShow={true} type="text" cols='12 6 4' placeholder='PESQUISAR' readOnly={false}
                                    input={{ onChange: this.handleChangeSearch, value: this.state.search }} grid={{ style: { paddingTop: '15px' } }} />
                            }

                            <table className={`table table-hover fixed`}>
                                {this.renderHead()}
                                {this.renderBody()}
                                {this.props.children}
                            </table>
                        </div>
                        <div className="box-footer">
                            {this.renderPagination()}
                        </div>
                    </div>
                </If>
            </React.Fragment>
        )
    }
}

export default withRouter(props => <Table {...props} />)