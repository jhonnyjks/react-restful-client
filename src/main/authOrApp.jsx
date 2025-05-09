import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { toastr } from "react-redux-toastr"
import Select from "react-select"

import '../common/template/dependences'
import App from './app'
import Auth from '../default/auth/auth'
import { validateToken, loading, logout } from '../default/auth/authActions'
import { can } from '../common/helpers/index'

const Loading = () => {
    return (
        <div className="login-page text-center">
            <div className="spinner-grow text-success" style={{width: "3rem", height: "3rem"}} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

class AuthOrApp extends Component {

    constructor(props) {
        super(props)

        this.state = {
            programActions: [],
            programAction: null,
            programSubaction: null,
        }

        //GLOBALS
        window.can = can

        this.interceptRequest.bind(this)
    }

    componentWillMount() {
        if (this.props.auth.token) {
            this.props.validateToken(this.props.auth.token, this.props.auth.profile)
        }
    }

    componentDidMount() {
        // Por padrão, remove o elemento de loading sempre que o React é carregado
        const initialLoadingSpinner = document.getElementById('initialLoadingSpinner')

        if(initialLoadingSpinner && typeof initialLoadingSpinner.remove == 'function') {
            initialLoadingSpinner.remove()
        }
    }

    getActions = () => {
        axios
          .get(`${process.env.REACT_APP_API_HOST}/program_actions?filter:id,name&with=programSubactions:id,name,program_action_id`)
          .then((resp) => {
            this.setState({ programActions: resp.data.data });
          })
          .catch((e) => {
            if (!e.response) {
              toastr.error(
                "Erro",
                "Não foi possível obter a lista de ações para o suporte. Por favor, tente novamente."
              );
              console.log(e);
            } else if (!e.response.data) {
              toastr.error("Erro", e.response.message);
            } else if (e.response.data) {
              toastr.error("Erro", e.response.data.message);
            }
          });
      };

      onSuportSubmit = () => {
        if(document.getElementById('suport_content').value.length < 10) {
            toastr.warning(
                "Atenção",
                "Por favor, descreva melhor sua solicitação"
              );

              return false
        }

        this.props.loading(true)
        axios
        .post(
            `${process.env.REACT_APP_API_HOST}/program_actions/suport`,
            {
                __program_action: this.state.programAction?.label || '---',
                __program_subaction: this.state.programSubaction?.label || '---',
                __content: document.getElementById('suport_content').value
            }
        )
        .then((resp) => {
            toastr.success(
                "Enviado!",
                "Enviado com sucesso!"
              );

            document.getElementById('suport_content').value = ''
            document.getElementById('suport_program_subaction').value = ''
            document.getElementById('suport_program_action').value = ''

            document.getElementById('suportModalCancel').click()

            this.props.loading(false)

            this.setState({
                programAction: null,
                programSubaction: null
              });
        })
        .catch((e) => {
            this.props.loading(false)
          if (!e.response) {
            toastr.error(
              "Erro",
              "Não foi possível enviar a mensagem para o suporte. Por favor, tente novamente."
            );
            console.log(e);
          } else if (!e.response.data) {
            toastr.error("Erro", e.response.message);
          } else if (e.response.data) {
            toastr.error("Erro", e.response.data.message);
          }
        });

        return false
      }

      handleActionChange = (e) => {
        if (e && e.value) {
          this.setState({
            programAction: e,
            programSubaction: null
          });
        }
      };

      handleSubactionChange = (e) => {
        if (e && e.value) {
          this.setState({
            programSubaction: e,
          });
        }
      };

    /**
     * 
     * @param {String} rel :: uma das relações da query string
     * @param {Array} scope :: o escopo de acesso da rota requisitada
     * @returns 'true' se a relação é um atributo com permissão de acesso de pelo menos leitura
     */
    hasPermOnRouteScope = (rel, scope) => {
        const relation = _.snakeCase(rel) + '_id'
        if(scope.actions[relation] && scope.actions[relation] > 0) return true
        return false
    }

    renderSuportModal = () => {

        if(this.state.programActions.length == 0) this.getActions()

        return <div
        className="modal fade"
        data-backdrop="static"
        data-keyboard="false"
        id="suportModal"
        tabIndex="-1"
        aria-labelledby="suportModalLabel"
        aria-hidden="true"
        >
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
            { this.props.auth.loading &&
            <div className="overlay d-flex justify-content-center" style={{paddingTop: '36%'}}>
                <i className="spinner-grow" role="status"></i>
            </div> }
            <div className="modal-header">
                <h5 className="modal-title" id="suportModalLabel">
                Suporte - Como podemos lhe atender melhor?
                </h5>
                <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                >
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <form>
                <div className="form-group">
                    <label htmlFor="suport_program_action" className="col-form-label"
                    >Ação <small>(Opcional)</small>:</label>
                   
                    <Select
                        id='suport_program_action'
                        name="program_action"
                        className="search-select-container"
                        classNamePrefix="search-select"
                        onChange={this.handleActionChange}
                        options={this.state.programActions.map((e) => ({
                            value: e.id,
                            label: e.id + " - " + e.name
                            })) || []
                        }
                        value={ this.state.programAction }
                        style={{zIndex: 11}}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="suport_program_subaction" className="col-form-label"
                    >Subação <small>(Opcional)</small>:</label>
                   
                    <Select
                        id='suport_program_subaction'
                        name="suport_program_subaction"
                        className="search-select-container"
                        classNamePrefix="search-select"
                        onChange={this.handleSubactionChange}
                        options={(() => {
                            let opts = []
                            if(this.state.programAction && this.state.programActions) {
                                const item = this.state.programActions.find(p => p.id == this.state.programAction.value)
                                
                                if(item && item.program_subactions) {
                                    return item.program_subactions.map((e) => ({
                                        value: e.id,
                                        label: e.id + " - " + e.name,
                                        }))
                                }
                            }

                            return opts
                        })()}
                        value={ this.state.programSubaction }
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="suport_content" className="col-form-label"
                    >Dúvidas e Sugestões:
                    </label>
                    <textarea className="form-control" id="suport_content" style={{height: '200px'}}></textarea>
                </div>
                </form>
            </div>
            <div className="modal-footer">
                <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                id="suportModalCancel" 
                >
                Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={this.onSuportSubmit}>Enviar</button>
            </div>
            </div>
        </div>
        </div>

    }

    render() {
        const { token, validToken, profile, loading, profiles } = this.props.auth

        // Tratamentos antes do request
        axios.interceptors.request.use(this.interceptRequest, function (error) {
            // Do something with request error
            return Promise.reject(error)
        })

        // Tratamentos pós request
        axios.interceptors.response.use(r => {
            return r
        }, function (error) {
            // Se o token não é válido, redireciona para a tela de login
            if(error.response?.data?.message.includes('Não autenticado.')) {
                this.props.logout()
            }

            // Do something with request error
            return Promise.reject(error)
        }.bind(this))

        if (token && validToken && profile) {
            axios.defaults.headers.common['authorization'] = token.type + ' ' + token.token
        }

        return <>
            { loading && <Loading /> }
            { (token && validToken && profile) && <App>{this.props.children}</App> }
            { !(token && validToken && profile) && <Auth /> }
            {(token && validToken && profile) && this.renderSuportModal()}
        </>
    }

    interceptRequest = (conf) => {

        const scopes = this.props.auth.profile ? this.props.auth.profile.scopes : {}
        let url = conf.url       

        // Tratando as permissões das entidades relacionadas na queryString
        if(url.indexOf('with=') > -1) {

            // Dividindo url e queryString
            url = url.split('?')
            url = url.filter(v => v.length)

            // Obtendo rota
            const route = url[0].replace(process.env.REACT_APP_API_HOST, '').replaceAll('/', '')

            // Dividindo queries
            url[1] = url[1].split('&')
            url[1] = url[1].filter(v => v.length)
            // Dividindo e validando entidades com permissões de escopos
            url[1] = url[1].map((queryy) => {
                let query = queryy.split('=')
                if(query[0] === 'with') {
                    query[1] = query[1].split(';').map((objStr) => {
                        // Dividindo entidade de atributos
                        let obj = objStr.split(':')
                       
                        // Dividindo entidades relacionadas
                        obj[0] = obj[0].split('.')
                        
                        // Buscando a rota que precisa ser validada, percorrendo as relações requisitadas
                        let relRoute = route
                        for (let i = 0; i < obj[0].length; i++) { 
                            if(scopes && scopes[relRoute] && scopes[relRoute].relationships && scopes[relRoute].relationships[obj[0][i]]) {
                                relRoute = _.findKey(scopes, ['entity', scopes[relRoute].relationships[obj[0][i]].entity])
                            } else {
                                console.warn('Se a rota não existe no escopo, não deveria chegar até aqui. Possível bug.', scopes, relRoute, obj[0][i])
                            }
                        }

                        //TODO: validar atributos das relações solicitadas na requisição. Atualmente valida apenas se o escopo existe.
                        // hasPermOnRouteScope() deve entrar em obsolescencia.
                        // if(obj[1]) obj[1] = obj[1].split(',')

                        // Se não existe escopo, remove da url.
                        if(relRoute || this.hasPermOnRouteScope(obj[0], scopes[route] || []) ) {
                            return objStr
                        } else {
                            // Removendo a relação da url
                            return null
                        }
                    }).join(';')
                }

                return query.join('=')

            }).join('&')

            // Junta url e remove caracteres indesejados
            const urll = url.shift()
            url = url[0].split('&')

            let withh = ''
            let search = ''
            let searchFields = ''
            let limit = ''
            let page = ''
            let remaining = ''


            while(url.length > 0) {
                let e = url.shift()

                switch (e.substring(0, e.indexOf('='))) {
                    case 'with':
                        withh = e.substring(e.indexOf('=')+1)
                        break;

                    case 'search':
                        search = e.substring(e.indexOf('=')+1)
                        break;

                    case 'searchFields':
                        searchFields = e.substring(e.indexOf('=')+1)
                        break;
                    
                    case 'limit':
                        limit = e.substring(e.indexOf('=')+1)
                        break;

                    case 'page':
                        page = e.substring(e.indexOf('=')+1)
                        break;

                    // Joga aqui tudo que não for desconhecido pelo bloco de código
                    default:
                        remaining += (e.length > 0 ? (remaining.length > 0 ? '&' : '') + e : '')
                        break;
                }
            }

            if(search[search.length-1] == ';') search = search.substring(0, search.length-1)
            if(withh[withh.length-1] == ';') withh = withh.substring(0, withh.length-1)

            if(search.length > 0) url.push('search=' + search)
            if(searchFields.length > 0) url.push('searchFields=' + searchFields)
            if(withh.length > 0) url.push('with=' + withh.replace(';;', ';').replace(':;', ';'))
            if(limit.length > 0 && !conf.url.includes('&export=true')) url.push('limit=' + limit)
            if(page.length > 0 && !conf.url.includes('&export=true')) url.push('page=' + page)
            if(remaining.length > 0) url.push(remaining)

            url = urll + '?' + url.join('&')

            if(conf.url.includes('&export=true')) {
                url = url.replace('&export=true', '')
            }
        }

        // Tratando as permissões dos atributos enviados na requisição
        let data = {}
        if(conf.data) {
            // Mapeando os métodos às permissões (Action->code)
            const methodToPermission = {
                'get': [1, 3, 5, 7, 9, 11, 13, 15],
                'post': [2, 3, 6, 7, 10, 11, 14, 15],
                'put': [4, 5, 6, 7, 12, 13, 14, 15],
                'delete': [8, 9, 10, 11, 12, 13, 14, 15]
            }

            // Removendo API, a fim de isolar a rota contida na url
            let route = url.replace(process.env.REACT_APP_API_HOST, '').split('/')
            // Se tinha '/' no começo da string, a rota ficou na segunda posição
            if(route[0] === '') route = route[1]
            else route = route[0] 

            // Se o escopo existe, remove atributos sem permissão
            if(scopes[route]) {
                Object.keys(conf.data).forEach(attr => {
                    if(methodToPermission[conf.method].includes(scopes[route].actions[attr]) || attr.slice(0, 2) == '__') data[attr] = conf.data[attr]
                })
            } else {
                data = conf.data
            }
        }

        return {...conf, url, data}
    }
}
const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators({ validateToken, loading, logout }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(AuthOrApp)