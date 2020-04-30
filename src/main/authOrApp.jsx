import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import '../common/template/dependences'
import App from './app'
import Auth from '../default/auth/auth'
import { validateToken } from '../default/auth/authActions'

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

        this.interceptRequest.bind(this)
    }

    componentWillMount() {
        if (this.props.auth.token) {
            this.props.validateToken(this.props.auth.token, this.props.auth.profile)
        }
    }

    render() {
        const { token, validToken, profile, loading } = this.props.auth

        // Tratamentos antes do request
        axios.interceptors.request.use(this.interceptRequest, function (error) {
            // Do something with request error
            return Promise.reject(error)
        })

        if (loading || (validToken && profile === null)) {
            return <Loading />
        } else if (token && validToken && profile) {
            axios.defaults.headers.common['authorization'] = token.type + ' ' + token.token
            return <App>{this.props.children}</App>
        } else {
            return <Auth />
        }
    }

    interceptRequest = (conf) => {
        let url = conf.url
        // Tratando as permissões das entidades relacionadas na queryString
        if(url.indexOf('with=') > -1) {

            const scopes = this.props.auth.profile.scopes
            
            // Dividindo url e queryString
            url = url.split('?')
            // Dividindo queries
            url[1] = url[1].split('&')
            // Dividindo evalidando entidades com permissões de escopos
            url[1] = url[1].map((queryy) => {
                let query = queryy.split('=')
                if(query[0] == 'with') {
                    query[1] = query[1].split(';').map((objStr) => {
                        // Dividindo entidade de atributos
                        let obj = objStr.split(':')

                        //TODO: validar atributos
                        // if(obj[1]) obj[1] = obj[1].split(',')
                       
                        // Dividindo entidades relacionadas
                        obj[0] = obj[0].split('.')
                        obj[0] = obj[0][obj[0].length-1]

                        // Verificando se a relação bate com uma rota ou entidade do escopo
                        const perm = _.findKey(scopes, ['entity', _.upperFirst(obj[0])])
                        // Se não existe escopo, remove da url
                        if(scopes[obj[0]] || perm) {
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
            url = url.join('?').split('=;').join('=')
        }

        return {...conf, url}
    }
}
const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators({ validateToken }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(AuthOrApp)