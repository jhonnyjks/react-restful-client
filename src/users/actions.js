import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { reset as resetForm, initialize } from 'redux-form'
import {showTabs, selectTab } from '../common/tab/tabActions'
import consts from '../consts'

const INITIAL_VALUES = {name: '', login: '', password: '', user_type_id: '', user_situation_id: ''}

export function getList() {
    const request = axios.get(`${consts.API_URL}/users`)
    return {
        type: 'USERS_FETCHED',
        payload: request
    }
}

export function create(values) {
    return submit(values, 'post')
}

export function update(values) {
    return submit(values, 'put')
}

export function remove(values) {
    return submit(values, 'delete')
}

function submit(values, method) {
    return dispatch => {
        const id = values.id ? values.id : ''
        axios[method](`${consts.API_URL}/users/${id}`, values)
        .then(resp => {
            toastr.success('Sucesso', 'Operação Realizada com sucesso.')
            dispatch(init())
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

export function showContent(flag) {
    return {
        type: 'FORM_SHOWED',
        payload: flag
    }
}

export function showUpdate(user) {
    return [
        showTabs('tabUpdate'),
        selectTab('tabUpdate'),
        initialize('userForm', user)
    ]
}

export function init() {
    return [
        initialize('userForm', INITIAL_VALUES),
        showContent('list')
    ]
}