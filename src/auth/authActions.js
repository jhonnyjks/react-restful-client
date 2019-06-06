import { toastr } from 'react-redux-toastr'
import axios from 'axios'
import _ from 'lodash'

export function login(values) {
    return submit(values, `${process.env.REACT_APP_API_HOST}/auth/login`)
}

export function signup(values) {
    return submit(values, `${process.env.REACT_APP_API_HOST}/auth/signup`)
}

function submit(values, url) {
    return dispatch => {
        axios.post(url, values)
            .then(resp => {
                toastr.success('Sucesso', resp.data.message)

                if (resp.data.data.profiles.length === 1) {
                    dispatch([
                        selectProfile(
                            resp.data.data.profiles.length ? resp.data.data.profiles[0] : null,
                            resp.data.data.token
                        )
                    ])
                }

                dispatch({ type: 'USER_FETCHED', payload: resp.data })

            })
            .catch(e => {
                if (!e.response) {
                    toastr.error('Erro', 'Desconhecido :-/')
                    console.log(e)
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else if (e.response.data.errors) {
                    Object.entries(e.response.data.errors).forEach(
                        ([key, error]) => toastr.error(key, error[0]))
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message)
                }
            })
    }
}

export function logout() {
    return { type: 'USER_FETCHED', payload: {} }
}

export function validateToken(token, profile) {
    return dispatch => {

        // Obtendo sessão salva para evitar requisição em ambiente dev
        if (process.env.NODE_ENV === 'local') {
            let devSession = JSON.parse(localStorage.getItem('devSession'))
            if (devSession) {
                dispatch({ type: 'USER_FETCHED', payload: devSession })
                dispatch({ type: 'PROFILE_SELECTED', payload: profile })
                return
            }
        }

        if (token) {
            axios.get(`${process.env.REACT_APP_API_HOST}/auth/validate`, {
                headers: { authorization: token.type + ' ' + token.token }
            }).then(resp => {

                // Salvando request para evitar requisição de validação de sessão em ambiente dev
                if (process.env.NODE_ENV === 'local') {
                    localStorage.setItem('devSession', JSON.stringify(resp.data))
                }

                const profiles = resp.data.data.profiles

                if (profiles.length === 1 && profile === null) {
                    dispatch(selectProfile(profiles[0], token))
                } else if (_.findIndex(profiles, { id: profile.id }) > -1) {
                    dispatch(selectProfile(profile, token))
                }

                dispatch({ type: 'USER_FETCHED', payload: resp.data })
            })
                .catch(e => dispatch({ type: 'USER_FETCHED', payload: false }))
        } else {
            dispatch({ type: 'USER_FETCHED', payload: false })
        }
    }
}

export function selectProfile(profile, token) {
    return dispatch => {
        if (profile) {
            axios.get(`${process.env.REACT_APP_API_HOST}/auth/define_profile/${profile.id}`, {
                headers: { authorization: token.type + ' ' + token.token }
            }).then(resp => {
                dispatch({ type: 'PROFILE_SELECTED', payload: profile })
            })
        } else {
            dispatch({ type: 'PROFILE_SELECTED', payload: null })
        }
    }
}