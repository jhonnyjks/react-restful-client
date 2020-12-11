import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'
import _ from 'lodash'

const INITIAL_VALUES = { route: '', attributes: {} }

export function getList(profileId) {

    return dispatch => {
        axios.get(`${process.env.REACT_APP_API_HOST}/permissions?search=profile_id:${profileId}&with=actions`)
            .then(resp => {
                // Declarando em um array para manipulável
                let permissions = resp.data.data

                // Concatenando o array de permissões a todas as permissões disponíveis
                axios.get(`${process.env.REACT_APP_API_HOST}/permissions/all`)
                    .then(resp2 => {

                        // Para cada permissão, verifica de ela já está no array 'permissions', e trata como deve
                        resp2.data.data.forEach(el => {
                            const cpath = el.route.replace('api/', '')
                            let i = _.findIndex(permissions, { cpath })

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
                            } else {

                                // concatenando à array as permissões que o perfil ainda não tem acesso
                                permissions.push({
                                    id: null,
                                    profile_id: profileId,
                                    permission_id: null,
                                    priority: 1,
                                    cpath,
                                    actions: el.attributes.map(attr => ({
                                        id: null,
                                        permission_id: null,
                                        noun: attr,
                                        code: 0
                                    }))
                                })
                            }
                        });

                        dispatch({
                            type: 'PERMISSIONS_FETCHED',
                            payload: permissions
                        })
                    })
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

export function createPermission(values, callback = null, params = null) {
    return submit(values, 'post', callback, params)
}

export function updatePermission(values) {
    return submit(values, 'put')
}

export function removePermission(values) {
    return submit(values, 'delete')
}

/**
 * Método genérico para envio de requisições ao serviço de permissões
 * @param {*} values 
 * @param String method 
 */
function submit(values, method, callback = null, params = {}) {
    return dispatch => {

        //'id' vai para a url se for positivo e não vazio e se o metodo não for 'post'
        const id = values.id > 0 && method !== 'post' ? +values.id : ''
        let filteredValues = { ...values }
        // 'id' não pode ir como parâmetro
        delete filteredValues.id

        axios[method](`${process.env.REACT_APP_API_HOST}/permissions${id ? '/'+id : ''}`, filteredValues)
            .then(resp => {
                console.log(callback)
                if (callback !== null) {
                    dispatch(callback({ ...params, permission_id: resp.data.data.id }))
                }
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

export function selectPermission(e, index) {
    e.preventDefault()
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
        delete filteredValues.id

        axios[method](`${process.env.REACT_APP_API_HOST}/actions${id ? '/'+id : ''}`, filteredValues)
            .then(resp => {
                toastr.success('Sucesso', 'Operação Realizada com sucesso.')
                dispatch({
                    type: 'PERMISSION_CHANGED',
                    payload: { ...values, id: resp.data.data.id ? resp.data.data.id : null }
                })
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

export function createAction(values) {
    return actionSubmit(values, 'post')
}

export function updateAction(values) {
    return actionSubmit(values, 'put')
}

export function removeAction(values) {
    return actionSubmit(values, 'delete')
}

export function changeAttribute(event, action, permission) {
    const code = action.code + (event.target.checked ? +event.target.value : -event.target.value)

    // Se tem ID, altera ou deleta
    if (action.id > 0) {
        if (code > 0) {
            return updateAction({ ...action, code })
        } else {
            return removeAction({ ...action, code })
        }
        // Se não tem ID, mas tem código válido, insere a permissão ao atributo
    } else if (code > 0) {

        // Se a rota já existe em permissions, insera a action. Senão, cria a rota em permissions
        // e depois insere a action
        if (action.permission_id > 0 || permission.id > 0) {
            return createAction({ ...action, permission_id: permission.id , code })
        } else {
            return createPermission({
                profile_id: permission.profile_id,
                cpath: permission.cpath,
                priority: permission.priority
            }, createAction, { ...action, code })
        }
    }

    return {
        type: 'PERMISSION_CHANGED',
        payload: { ...action, code }
    }
}