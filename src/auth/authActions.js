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
    console.log(values);
    return dispatch => {
        axios.post(url, values)
            .then(resp => {
                dispatch([
                    { type: 'USER_FETCHED', payload: resp.data }
                ])
            })
            .catch(e => {
                if (e.response.data.errors) {
                    Object.entries(e.response.data.errors).forEach(
                        ([key, error]) => toastr.error(key, error[0]))
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
            axios.post(`${consts.OAPI_URL}/validateToken`, { token })
                .then(resp => {
                    dispatch({ type: 'TOKEN_VALIDATED', payload: resp.data.valid })
                })
                .catch(e => dispatch({ type: 'TOKEN_VALIDATED', payload: false }))
        } else {
            dispatch({ type: 'TOKEN_VALIDATED', payload: false })
        }
    }
}