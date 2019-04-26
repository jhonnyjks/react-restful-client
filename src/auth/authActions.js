import { toastr } from 'react-redux-toastr'
import axios from 'axios'

import consts from '../consts'

export function login(values) {
    return submit(values, `${consts.API_URL}/auth/login`)
}

export function signup(values) {
    return submit(values, `${consts.API_URL}/auth/signup`)
}

function submit(values, url) {
    return dispatch => {
        axios.post(url, values)
            .then(resp => {
                toastr.success('Sucesso', resp.data.message)
                dispatch([
                    { type: 'USER_FETCHED', payload: resp.data }
                ])
            })
            .catch(e => {
                if (e.response.data && e.response.data.errors) {
                    Object.entries(e.response.data.errors).forEach(
                        ([key, error]) => toastr.error(key, error[0]))
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else {
                    toastr.error('Erro', e.response.data.message)
                }
            })
    }
}

export function logout() {
    return { type: 'TOKEN_VALIDATED', payload: false }
}

export function validateToken(token) {
    return dispatch => {
        if (token) {
            axios.get(`${consts.API_URL}/auth/validate`, {
                headers: { authorization: token.type + ' ' + token.token }
            }).then(resp => {

                // ATIVANDO MODO DEVMASTER
                axios.get(`${consts.API_URL}/auth/permissions/use-all`, {
                    headers: { authorization: token.type + ' ' + token.token }
                }).then(resp => {
                    dispatch({ type: 'DEVMASTER_ACTIVATED', payload: true })
                    dispatch({ type: 'TOKEN_VALIDATED', payload: true })
                })
                .catch(e => dispatch({ type: 'DEVMASTER_ACTIVATED', payload: false }))
                /////////////////////////
                //dispatch({ type: 'TOKEN_VALIDATED', payload: true })
                })
                .catch(e => dispatch({ type: 'TOKEN_VALIDATED', payload: false }))
        } else {
            dispatch({ type: 'TOKEN_VALIDATED', payload: false })
        }
    }
}