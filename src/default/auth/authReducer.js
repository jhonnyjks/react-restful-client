const sesionKey = '_react_client_session'
const profileKey = '_react_client_profile'
const INITIAL_STATE = JSON.parse(localStorage.getItem(sesionKey)) ? {
    user: JSON.parse(localStorage.getItem(sesionKey)).user,
    token: JSON.parse(localStorage.getItem(sesionKey)).token,
    profile: JSON.parse(localStorage.getItem(profileKey)),
    custom: JSON.parse(localStorage.getItem(sesionKey)).custom,
    profiles: [],
    validToken: false,
    loading: false
} : {
        validToken: false, user: null, token: null, profile: null, profiles: [], loading: false, custom: null
    }

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case 'USER_FETCHED':
            if (action.payload.data && action.payload.data.user) {
                localStorage.setItem(sesionKey, JSON.stringify({
                    user: action.payload.data.user,
                    token: {
                        ...state.token,
                        ...action.payload.data.token
                    }
                }))

                return {
                    ...state,
                    user: action.payload.data.user,
                    token: {
                        ...state.token,
                        ...action.payload.data.token
                    },
                    profiles: action.payload.data.profiles,
                    profile: null,
                    validToken: true
                }
            } else {
                localStorage.removeItem(sesionKey)
                localStorage.removeItem(profileKey)
                return { ...state, validToken: false, user: null, token: null, profile: null, profiles: [], custom: null }
            }

        case 'PROFILE_SELECTED':
            localStorage.setItem(profileKey, JSON.stringify(action.payload))
            return { ...state, profile: action.payload }

        case 'USER_CHANGED':
            localStorage.setItem(sesionKey, JSON.stringify({
                user: action.payload,
                token: state.token
            }))

            return {
                ...state,
                user: action.payload
                }
        
        case 'AUTH_LOADINGG':
            localStorage.setItem(profileKey, JSON.stringify(action.payload))
            return { ...state, loading: action.payload }

        case 'AUTH_EXTRA':
            localStorage.setItem(sesionKey, JSON.stringify({
                user: state.user,
                token: state.token, 
                custom: {...state.custom, ...action.payload}
            }))

            return {
                ...state,
                custom: {...state.custom, ...action.payload}
                }

        default:
            return state
    }
}