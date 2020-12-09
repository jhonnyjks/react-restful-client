import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

// STATES
const INITIAL_STATE = {
    list: [],
    show: 'list',
    errors: {}
}

const INITIAL_VALUES = {
    city_id: null,
    user_id: null
}

// ACTIONS
export function getList(id) {
    const request = axios.get(`${process.env.REACT_APP_API_HOST}/user_profiles?search=user_id:${id}&with=profile:id,noun`)
    return {
        type: 'USER_PROFILE_FETCHED',
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
        const id = values.id ? values.id + 0 : ''
        let filteredValues = { ...values }
        if (id) delete filteredValues.id

        dispatch(getValidation({}))
        axios[method](`${process.env.REACT_APP_API_HOST}/user_profiles${id ? '/'+id : ''}`, filteredValues)
            .then(resp => {
                toastr.success('Sucesso', 'Operação Realizada com sucesso.')

                dispatch(getList(values.user_id))
                dispatch(init())
            })
            .catch(e => {
                if (!e.response) {
                    toastr.error('Erro', 'Desconhecido :-/')
                    console.log('Erro', e)
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else if (e.response.data.errors) {
                    dispatch(getValidation(e.response.data.errors))
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message)
                }
            })
    }
}

export function showContent(flag) {
    return {
        type: 'USER_PROFILE_CONTENT_CHANGED',
        payload: flag
    }
}

export function showUpdate(userProfile) {
    return [
        showContent('form'),
        initialize('userProfileForm', userProfile)
    ]
}

export function init() {
    return [
        initialize('userProfileForm', INITIAL_VALUES),
        showContent('list')
    ]
}

export function getValidation(errors) {
    return {
        type: 'USER_PROFILE_FORM_ERRORS',
        payload: errors
    }
}

//REDUCER
export const userProfileReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'USER_PROFILE_FETCHED':
            return { ...state, list: action.payload.data ? action.payload.data.data : [] }

        case 'USER_PROFILE_CONTENT_CHANGED':
            return {...state, show: action.payload}

        case 'USER_PROFILE_FORM_ERRORS':
            return { ...state, errors: action.payload }

        default:
            return state;
    }
}