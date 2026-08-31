import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

const INITIAL_VALUES = {name: '', login: '', password: '', general_status_id: ''}

export function getList() {
    const request = axios.get(`${process.env.REACT_APP_API_HOST}/users?with=generalStatus`)
    return {
        type: 'USERS_FETCHED',
        payload: request
    }
}

export function create(values) {
    return submit(values, 'post')
}

export function update(values) {

    // Removendo atributos do tipo Objeto.
    Object.keys(values).forEach(function(value, index) {
        if(!values[value] || values[value].id) delete values[value]
    })

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
        
        axios[method](`${process.env.REACT_APP_API_HOST}/users${id ? '/'+id : ''}`, filteredValues)
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
        type: 'USER_CONTENT_CHANGED',
        payload: flag
    }
}

export function showUpdate(user) {
    return [
        showContent('form'),
        initialize('userForm', user)
    ]
}

export function init() {
    return [
        initialize('userForm', INITIAL_VALUES),
        showContent('list')
    ]
}