import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'
import consts from '../../consts'

const INITIAL_VALUES = { route: '', attributes: {} }

export function getList() {
    const request = axios.get(`${consts.API_URL}/permissions/all`)
    return {
        type: 'PERMISSIONS_FETCHED',
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
        const id = values.id ? values.id+0 : ''
        let filteredValues = {...values}
        if(id) delete filteredValues.id
        
        axios[method](`${consts.API_URL}/permissions/${id}`, filteredValues)
        .then(resp => {
            toastr.success('Sucesso', 'Operação Realizada com sucesso.')
            dispatch(init())
            dispatch(getList())
        })
        .catch(e => {
            if (e.response.data && e.response.data.errors) {
                Object.entries(e.response.data.errors).forEach(
                    ([key, error]) => toastr.error(key, error[0]))
            } else if (e.response.data) {
                toastr.error('Erro', e.response.data.message)
            } else {
                toastr.error('Erro', e.response.message)
            }
        })
    }
}

export function showContent(flag) {
    return {
        type: 'PERMISSION_FORM_SHOWED',
        payload: flag
    }
}

export function showUpdate(values) {
    return [
        showContent('form'),
        initialize('permissionForm', values)
    ]
}

export function init() {
    return [
        initialize('permissionForm', INITIAL_VALUES),
        showContent('list')
    ]
}

export function selectPermission(permision) {
    return {
        type: 'PERMISSION_SELECTED',
        payload: permision 
    }
}