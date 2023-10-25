import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import '../common/template/dependences'
import App from './app'
import Auth from '../default/auth/auth'
import { validateToken } from '../default/auth/authActions'
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

    render() {
        const { token, validToken, profile, loading, profiles } = this.props.auth

        // Tratamentos antes do request
        axios.interceptors.request.use(this.interceptRequest, function (error) {
            // Do something with request error
            return Promise.reject(error)
        })

        if (token && validToken && profile) {
            axios.defaults.headers.common['authorization'] = token.type + ' ' + token.token
        }

        return <>
            { loading && <Loading /> }
            { (token && validToken && profile) && <App>{this.props.children}</App> }
            { !(token && validToken && profile) && <Auth /> }
        </>
    }

    interceptRequest = (conf) => {

        const scopes = this.props.auth.profile ? this.props.auth.profile.scopes : {}
        let url = conf.url       

        // Tratando as permissões das entidades relacionadas na queryString
        if(url.indexOf('with=') > -1) {

            // Dividindo url e queryString
            url = url.split('?')

            // Obtendo rota
            const route = url[0].replace(process.env.REACT_APP_API_HOST, '').replaceAll('/', '')

            // Dividindo queries
            url[1] = url[1].split('&')
            // Dividindo evalidando entidades com permissões de escopos
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
                                console.warn('Se a rota não existe no escopo, não deveria chegar até aqui. Possível bug.', scopes, relRoute)
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
            if(limit.length > 0) url.push('limit=' + limit)
            if(remaining.length > 0) url.push(remaining)

            url = urll + '?' + url.join('&')
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
                    if(methodToPermission[conf.method].indexOf(scopes[route].actions[attr]) > -1) data[attr] = conf.data[attr]
                })
            } else {
                data = conf.data
            }
        }

        return {...conf, url, data}
    }
}
const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators({ validateToken }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(AuthOrApp)