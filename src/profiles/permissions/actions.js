import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'
import _ from 'lodash'
import consts from '../../consts'

const INITIAL_VALUES = { route: '', attributes: {} }

export function getList(profileId) {

    return dispatch => {
        axios.get(`${consts.API_URL}/permissions?search=profile_id:${profileId}&with=actions`)
            .then(resp => {
                // Declarando em um array para manipulável
                let permissions = resp.data.data

                // Concatenando o array de permissões a todas as permissões disponíveis
                axios.get(`${consts.API_URL}/permissions/all`)
                    .then(resp2 => {

                        // Para cada permissão, verifica de ela já está no array 'permissions', e trata como deve
                        resp2.data.data.forEach(el => {
                            let i = _.findIndex(permissions, { cpath: el.route.replace('api/', '') })

                            // Se achou a permissão, verifica os atributos
                            if (i > -1) {
                                // Invertendo para que os atributos virem as chaves do elemento
                                let attributes = _.invert(el.attributes)

                                // Removendo do array de atributos os atributos que já estão no array de permissões
                                permissions[i].actions.forEach(attr => {
                                    delete attributes[attr.noun]
                                })

                                // Completando o array de permissões com os atributos que esse perfil não tem acesso ainda
                                // Sempre com 'code: 0', já que o perfil não tem permissão de acesso a estes.
                                for (var key in attributes) {
                                    if (attributes.hasOwnProperty(key)) {
                                        permissions[i].actions.push({
                                            id: null,
                                            permission_id: permissions[i].id,
                                            noun: key,
                                            code: 0
                                        })
                                    }
                                }
                            }
                        });

                        dispatch({
                            type: 'PERMISSIONS_FETCHED',
                            payload: permissions
                        })
                    })
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

export function create(values) {
    return submit(values, 'post')
}

export function update(values) {
    return submit(values, 'put')
}

export function remove(values) {
    return submit(values, 'delete')
}

/**
 * Método genérico para envio de requisições ao serviço de permissões
 * @param {*} values 
 * @param String method 
 */
function submit(values, method) {
    return dispatch => {
        const id = values.id ? values.id + 0 : ''
        let filteredValues = { ...values }
        if (id) delete filteredValues.id

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

export function selectPermission(index) {
    return {
        type: 'PERMISSION_SELECTED',
        payload: index
    }
}

function actionSubmit(values, method) {
    return dispatch => {
        //'id' vai para a url se for positivo e não vazio e se o metodo não for 'post'
        const id = values.id > 0 && method !== 'post' ? +values.id : ''
        let filteredValues = { ...values }
        // 'id' não pode ir como parâmetro
        if (filteredValues.id !== undefined) delete filteredValues.id

        axios[method](`${consts.API_URL}/actions/${id}`, filteredValues)
            .then(resp => {
                toastr.success('Sucesso', 'Operação Realizada com sucesso.')
                dispatch({
                    type: 'PERMISSION_CHANGED',
                    payload: { ...values, id: resp.data.data.id ? resp.data.data.id : null }
                })
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

export function changeAttribute(event, item) {
    const code = item.code + (event.target.checked ? +event.target.value : -event.target.value)
    let method = 'post'

    if (item.id > 0) {
        if (code > 0) {
            method = 'put'
        } else {
            method = 'delete'
        }
    } else if (code > 0) {

    }

    return actionSubmit({ ...item, code }, method)
}