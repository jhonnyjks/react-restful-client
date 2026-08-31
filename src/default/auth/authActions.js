import { toastr } from 'react-redux-toastr'
import axios from 'axios'
import _ from 'lodash'
import { initNotifications } from '../../common/template/templateActions';
import {sesionKey} from './authReducer'

export function login(values, url) {
    return submit(values, url)
}

function isBearerSession(token) {
    return token?.sessionType === 'bearer'
}

function isBearerResponse(response) {
    return Boolean(response?.token && response?.user && !response?.data)
}

function normalizeResponse(response) {
    if (!isBearerResponse(response)) {
        return response
    }

    const permissoes = Array.isArray(response.permissoes) ? response.permissoes : []
    const profiles = Array.isArray(response.perfis)
        ? response.perfis.map(profile => ({
            ...profile,
            noun: profile.noun || profile.nome,
            scopes: profile.scopes || {},
            permissoes: profile.permissoes || permissoes
        }))
        : []

    return {
        message: response.message || 'Sessão iniciada com sucesso.',
        data: {
            user: response.user,
            token: {
                type: response.token_type || 'Bearer',
                token: response.token,
                sessionType: 'bearer'
            },
            profiles,
            permissoes
        }
    }
}

function selectAvailableProfile(session, currentProfile = null) {
    const profiles = session.data.profiles || []

    return profiles.find(profile => profile.id === currentProfile?.id) ||
        profiles[0] || {
            id: 'default',
            noun: 'Acesso',
            scopes: {},
            permissoes: session.data.permissoes || []
        }
}

function submit(values, url) {
    switch (url) {
        case 'login':
            url = `${process.env.REACT_APP_API_HOST}/auth/login`;
            break;
        case 'signup':
            url = `${process.env.REACT_APP_API_HOST}/auth/signup`;
            break;
        case 'reset':
            url = `${process.env.REACT_APP_API_HOST}/auth/change-password`;
            break;
        case 'verified-email':
            url = `${process.env.REACT_APP_API_HOST}/auth/verified-email`;
            break;
        default:
            break;
    }

    return dispatch => {

        dispatch({ type: 'AUTH_LOADING', payload: true });

        const payload = url.endsWith('/auth/login')
            ? {
                ...values,
                email: values.email || values.login,
                login: values.login || values.email
            }
            : values

        return axios.post(url, payload)
            .then(resp => {
                const session = normalizeResponse(resp.data)
                const profiles = session.data?.profiles || []
                const bearerSession = isBearerSession(session.data?.token)

                dispatch({ type: 'USER_FETCHED', payload: session });

                if (bearerSession) {
                    dispatch({ type: 'PROFILE_SELECTED', payload: selectAvailableProfile(session) });
                    dispatch({ type: 'AUTH_LOADING', payload: false });
                    toastr.success('Sucesso', session.message);
                } else if (profiles.length === 1) {
                    toastr.success('Sucesso', session.message);
                    dispatch([
                        selectProfile(profiles[0], session.data.token)
                    ]);
                } else {
                    toastr.info('Sucesso', session.message);
                    dispatch({ type: 'AUTH_LOADING', payload: false });
                }

                return resp;
            })
            .catch(e => {
                dispatch({ type: 'AUTH_LOADING', payload: false });

                if (!e.response) {
                    toastr.error('Erro', 'Desconhecido :-/');
                    console.log(e);
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message);
                } else if (e.response.data.errors) {
                    Object.entries(e.response.data.errors).forEach(
                        ([key, error]) => toastr.error(key, error[0])
                    );
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message || e.response.data.error || 'Não foi possível autenticar.');
                }

                return e.response;
            });
    };
}

export function logout() {
    return (dispatch, getState) => {
        const token = getState().auth.token
        const request = isBearerSession(token)
            ? axios.post(`${process.env.REACT_APP_API_HOST}/auth/logout`, {}, {
                headers: { authorization: token.type + ' ' + token.token }
            })
            : axios.get(`${process.env.REACT_APP_API_HOST}/auth/logout`)

        return request.catch(() => null).then(() => {
            dispatch(initNotifications());
            dispatch({ type: 'USER_FETCHED', payload: {} })
        })
    }
}

export function validateToken(token, profile) {
    return dispatch => {

        dispatch({ type: 'AUTH_LOADING', payload: true })

        if (isBearerSession(token)) {
            return axios.post(`${process.env.REACT_APP_API_HOST}/auth/refresh`, {}, {
                headers: { authorization: token.type + ' ' + token.token }
            }).then(resp => {
                const session = normalizeResponse(resp.data)
                dispatch({ type: 'USER_FETCHED', payload: session })
                dispatch({ type: 'PROFILE_SELECTED', payload: selectAvailableProfile(session, profile) })
                dispatch({ type: 'AUTH_LOADING', payload: false })
            }).catch(() => {
                dispatch({ type: 'USER_FETCHED', payload: false })
                dispatch({ type: 'AUTH_LOADING', payload: false })
            })
        }

        // Obtendo sessão salva para evitar requisição
        let devSession = JSON.parse(localStorage.getItem(sesionKey))
        if (devSession) {
            dispatch({ type: 'USER_FETCHED', payload: devSession })
            dispatch({ type: 'PROFILE_SELECTED', payload: profile })
            dispatch({ type: 'AUTH_LOADING', payload: false })
            return
        }
        

        if (token) {
            axios.get(`${process.env.REACT_APP_API_HOST}/auth/validate`, {
                headers: { authorization: token.type + ' ' + token.token }
            }).then(resp => {

                const profiles = resp.data.data.profiles

                if (profiles.length === 1 && profile === null) {
                    dispatch(selectProfile(profiles[0], token))
                } else if (_.findIndex(profiles, { id: profile.id }) > -1) {
                    dispatch(selectProfile(profile, token))
                }

                dispatch({ type: 'USER_FETCHED', payload: resp.data })
            })
                .catch(e => {
                    dispatch({ type: 'USER_FETCHED', payload: false })
                    dispatch({ type: 'AUTH_LOADING', payload: false })
                })
        } else {
            dispatch({ type: 'USER_FETCHED', payload: false })
            dispatch({ type: 'AUTH_LOADING', payload: false })
        }
    }
}

export function selectProfile(profile, token) {
    return dispatch => {

        dispatch({ type: 'AUTH_LOADING', payload: true })

        if (isBearerSession(token)) {
            dispatch({
                type: 'PROFILE_SELECTED',
                payload: { ...profile, scopes: profile.scopes || {}, permissoes: profile.permissoes || [] }
            })
            dispatch({ type: 'AUTH_LOADING', payload: false })
            return Promise.resolve()
        }

        if (profile) {
            return axios.get(`${process.env.REACT_APP_API_HOST}/auth/define_profile/${profile.id}`, {
                headers: { authorization: token.type + ' ' + token.token }
            }).then(resp => {
                dispatch({ type: 'PROFILE_SELECTED', payload: { ...profile, scopes: resp.data.scopes } })
                dispatch({ type: 'AUTH_LOADING', payload: false })
            })
        } else {
            dispatch({ type: 'PROFILE_SELECTED', payload: null })
            dispatch({ type: 'AUTH_LOADING', payload: false })
        }
    }
}

export function loading(status = null) {
    return { type: 'AUTH_LOADING', payload: status }
}