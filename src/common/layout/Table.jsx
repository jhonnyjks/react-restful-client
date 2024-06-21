import React, { Component } from 'react'
import Select from "react-select";
import { Link, withRouter } from "react-router-dom";
import _ from 'lodash'

import "./react-select-custom.css"
import "./table.css"
import LabelAndInput from '../form/LabelAndInput';
import ButtonListTrashed from '../form/ButtonListTrashed';
import If from '../operator/If'
import Row from './row'
import { Button } from 'react-bootstrap';
import { head } from 'lodash';
class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            queryStrSearch: {},
            searchFields: {},
            searchFieldsValues: {},
            searchFieldsOrder: {},
            withTrashed: false
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

    doSearch = (e = null, search = null, page = null) => {

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
        const pageQueryParam = page !== null ? `?page=${page}` : '?page=1'; // REMOVER O '?' E COLOCAR DIRETAMENTE NA URL DO GETLIST

        let orderBy = ''
        let sortedBy = ''

        // Adicionar na URL apenas colunas que não são relações, pois relações não funcionam para ordenar na API
        Object.keys(this.state.searchFieldsOrder).forEach( orderField => {
            if(orderField.indexOf('.') == -1) {
                orderBy += (orderBy.length > 0 ? ';' : '') + orderField
                sortedBy += (sortedBy.length > 0 ? ';' : '') + this.state.searchFieldsOrder[orderField]
            }
        })
        
        this.props.attributesSearch(
            pageQueryParam + '&search=' + queryStr + '&searchJoin=and' +
            (orderBy.length > 0 ? '&orderBy=' + orderBy : '') + 
            (sortedBy.length > 0 ? '&sortedBy=' + sortedBy : ''));

        this.setState({ queryStrSearch, searchFields, searchFieldsValues })
    }

    getBody() {
        let body = this.props.paginate ? this.props.body.data : this.props.body
        const orderFields = Object.keys(this.state.searchFieldsOrder)

        if(orderFields.length > 0 && ( orderFields.toString().indexOf('.') > -1 || !this.props.attributesSearch )) {
            body = _.orderBy(body, orderFields, Object.values(this.state.searchFieldsOrder));
        }

        return body
    }

    onClickReorder = (e, val) => {
        let btn = e.target

        if(btn.tagName != 'DIV') {
            btn = btn.parentElement
        }

        if(btn.tagName != 'DIV') {
            btn = btn.parentElement
        }

        if(btn) {
            if(btn.classList.contains('up')) {
                let sfo = {...this.state.searchFieldsOrder}
                delete sfo[val]
                
                this.setState(
                {searchFieldsOrder: { [val]: 'desc', ...sfo}},
                    () => {
                        // Se attributesSearch foi setada e 'val' não tem ponto, ou seja, é uma coluna e não uma relação 
                        if(this.props.attributesSearch && val.indexOf('.') == -1) {
                            this.doSearch()
                        }
                    }
                )
                btn.classList.replace('up', 'down')
            } else {
                let sfo = {...this.state.searchFieldsOrder}
                delete sfo[val]

                this.setState(
                    {searchFieldsOrder: { [val]: 'asc', ...sfo }},
                    () => {
                        // Se attributesSearch foi setada e 'val' não tem ponto, ou seja, é uma coluna e não uma relação
                        if(this.props.attributesSearch && val.indexOf('.') == -1) {
                            this.doSearch()
                        }
                    }
                )
                btn.classList.replace('down', 'up')
            }
        }
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
                        return <th key={index} style={ !head[val].notColor ? head[val].style || {} : {}}>
                             <span style={{display: 'block', float: 'left'}}>{ head[val].title || head[val] }</span>
                             { this.props.attributesSearch &&
                                 <div 
                                     className='carret-up-down up'
                                     onClick={ e => this.onClickReorder(e, val)}
                                     title={val.indexOf('.') < 0 ? 'Ordenar todos os registros' : 'Ordenar registros dessa página'}
                                     data-toggle="tooltip"
                                 >
                                     <i className="fas fa-caret-up fa-fw table-carret"></i>
                                     <i className="fas fa-caret-down fa-fw table-carret"></i>
                                 </div>
                             }
                         </th>
                                              
                     })
                )}
                
                {this.props.withTrashed && <th><ButtonListTrashed 
                                                title="Incluir itens excluídos"
                                                onListTrashed={this.props.actionsHeader.listTrashed}
                                                onColorResolve={this.props.iconColorResolve.onColorResolve}                                               
                                                ></ButtonListTrashed></th> }


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

        let withTrashedActive = false
            Object.getOwnPropertyNames(head).map((val, index) => {
                if (head.withTrashed) withTrashedActive = true
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
                            case 'trashed':
                                return <th key={index} style={head[val].style || {}}>
                                            {/* caso resolvam usar icon trashed de forma mais organizada */}
                                            {/* <ButtonListTrashed 
                                                title="Incluir itens excluídos"
                                                onListTrashed={this.props.actionsHeader.listTrashed}                                               
                                            ></ButtonListTrashed> */}
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

                    

            {/* {withTrashedActive && <ButtonListTrashed  title="Incluir itens excluídos"></ButtonListTrashed> } */}
            {this.props.actions && <th></th>}
        </tr>
    }

    renderBody = () => {
        const body = this.getBody()
        const actionsPath = this.props.path || this.props.location.pathname
        
        if (body.length) {
            return <tbody>
                {
                    body.map((ntr, ii) => {
                        let tr = []                        
                 
                        if (this.props.attributes) {
                            tr = Object.keys(this.props.attributes)
                        } else {
                            tr = Object.keys(ntr)
                        }

                        return <tr key={tr.id || ii} >
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
                                        //console.log(n)
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

                                   // return <th key={index}>{n}</th>
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
                                            style={ !ntr.deleted_at ? { border: '0px', background: 'none', fontSize: '1.2em', color: '#333', marginLeft: '20px' } : {visibility: 'hidden'}} >
                                            <i className='fa fa-trash-alt'></i>
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
        }else{
            const head = this.props.attributes
            const cols = Object.getOwnPropertyNames(head).length
            return (
                <tbody>
                    <tr>
                        <td colSpan={cols+1}>

                <div className='row'>
                    <div className='col col-12 text-center'>
                        <img alt="" src="data:image/png;base64,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" />
                        <p>Não há dados a serem exibidos</p>
                    </div>
                </div>
                        </td>
                    </tr>
                </tbody>
            )
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
                                                    <i className='fa fa-trash-alt'></i> Excluir
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
        const displayPages = 5; // Exibir 20 páginas por padrão
        const total = pagination.total;
        const to = pagination.to;
      
        let startPage = Math.max(1, currentPage - Math.floor(displayPages / 2));
        let endPage = Math.min(totalPages, startPage + displayPages - 1);
      
        // Ajusta o intervalo de páginas se estiver perto do final
        if (endPage === totalPages && startPage > 1) {
          startPage = Math.max(1, endPage - displayPages + 1);
        }
      
        // Adiciona páginas ao redor da página atual
        for (let i = startPage; i <= endPage; i++) {
          pages.push(
            <li key={i} className={`page-item ${i === currentPage ? '' : ''}`}>
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
          <div className="card-footer bg-white clearfix">
            <div className='row'>
                <div className='col'>
                    <p className='m-0 float-left mt-3'>Exibindo {to} de {total} resultados</p>
                </div>
                <div className='col'>
                    <ul className="pagination pagination-sm m-0 float-right mt-3">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <a
                        className="page-link"
                        onClick={() => this.doSearch(null, null, currentPage - 1)}
                        aria-label="Previous"
                        >
                            <i className="fas fa-angle-double-left"></i>
                        </a>
                    </li>
                    {pages}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <a
                        className="page-link"
                        onClick={() => this.doSearch(null, null, currentPage + 1)}
                        aria-label="Next"
                        >
                        <i className="fas fa-angle-double-right"></i>
                        </a>
                    </li>
                    </ul>

                </div>
            </div>
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