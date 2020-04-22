import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import '../common/template/dependences'
import App from './app'
import Auth from '../default/auth/auth'
import { validateToken } from '../default/auth/authActions'

const Loading = () => {
    return (
        <div className="login-page text-center">
            <div class="spinner-grow text-success" style={{width: "3rem", height: "3rem"}} role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    )
}

class AuthOrApp extends Component {
    componentWillMount() {
        if (this.props.auth.token) {
            this.props.validateToken(this.props.auth.token, this.props.auth.profile)
        }
    }

    render() {
        const { token, validToken, profile, loading } = this.props.auth

        if (loading || (validToken && profile === null)) {
            return <Loading />
        } else if (token && validToken && profile) {
            axios.defaults.headers.common['authorization'] = token.type + ' ' + token.token
            return <App>{this.props.children}</App>
        } else {
            return <Auth />
        }

    }
}
const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators({ validateToken },
    dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(AuthOrApp)