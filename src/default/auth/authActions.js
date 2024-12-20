import { toastr } from 'react-redux-toastr'
import axios from 'axios'
import _ from 'lodash'

export function login(values, url) {
    return submit(values, url)
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
        case 'verifield-email':

            const apiHost = process.env.REACT_APP_API_HOST;
            const baseUrl = apiHost.replace('/api', '');

            url = `${baseUrl}/email/verify/${values.id}/${values.hash}`;
            console.log('entrou em verifield-email');
            console.log('values: ', values);
            console.log('url: ', url);
            console.log('url padrão: ', `${baseUrl}`);
            
            break;
        default:
            break;
    }

    return dispatch => {
        console.log('entrou...');

        dispatch({ type: 'AUTH_LOADING', payload: true });

        // Verificar se a rota usa GET ou POST
        const method = url.includes('/email/verify/') ? 'get' : 'post';

        return axios[method](url, method === 'post' ? values : { params: values })
            .then(resp => {
                if (resp.data.data && resp.data.data.profiles && resp.data.data.profiles.length === 1) {
                    toastr.success('Sucesso', resp.data.message);
                    dispatch([
                        selectProfile(
                            resp.data.data.profiles.length ? resp.data.data.profiles[0] : null,
                            resp.data.data.token
                        )
                    ]);
                } else {
                    toastr.info('Sucesso', resp.data.message);
                    dispatch({ type: 'AUTH_LOADING', payload: false });
                }

                dispatch({ type: 'USER_FETCHED', payload: resp.data });
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
                    toastr.error('Erro', e.response.data.message);
                }

                return e.response;
            });
    };
}

export function logout() {
    axios.get(`${process.env.REACT_APP_API_HOST}/auth/logout`)
    
    return { type: 'USER_FETCHED', payload: {} }
}

export function validateToken(token, profile) {
    return dispatch => {

        dispatch({ type: 'AUTH_LOADING', payload: true })

        // Obtendo sessão salva para evitar requisição em ambiente dev
        if (process.env.NODE_ENV === 'developmentt') {
            let devSession = JSON.parse(localStorage.getItem('devSession'))
            if (devSession) {
                dispatch({ type: 'USER_FETCHED', payload: devSession })
                dispatch({ type: 'PROFILE_SELECTED', payload: profile })
                dispatch({ type: 'AUTH_LOADING', payload: false })
                return
            }
        }

        if (token) {
            axios.get(`${process.env.REACT_APP_API_HOST}/auth/validate`, {
                headers: { authorization: token.type + ' ' + token.token }
            }).then(resp => {

                // Salvando request para evitar requisição de validação de sessão em ambiente dev
                if (process.env.NODE_ENV === 'developmentt') {
                    localStorage.setItem('devSession', JSON.stringify(resp.data))
                }

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

        if (profile) {
            axios.get(`${process.env.REACT_APP_API_HOST}/auth/define_profile/${profile.id}`, {
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