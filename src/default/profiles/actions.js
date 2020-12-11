import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

const INITIAL_VALUES = { noun: '', description: '' }

export function getList() {
    const request = axios.get(`${process.env.REACT_APP_API_HOST}/profiles`)
    return {
        type: 'PROFILES_FETCHED',
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
        
        axios[method](`${process.env.REACT_APP_API_HOST}/profiles${id ? '/'+id : ''}`, filteredValues)
        .then(resp => {
            toastr.success('Sucesso', 'Operação Realizada com sucesso.')
            dispatch(init())
            dispatch(getList())
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

export function showContent(flag) {
    return {
        type: 'PROFILE_CONTENT_CHANGED',
        payload: flag
    }
}

export function showUpdate(values) {
    return [
        showContent('form'),
        initialize('profileForm', values)
    ]
}

export function init() {
    return [
        initialize('profileForm', INITIAL_VALUES),
        showContent('list')
    ]
}