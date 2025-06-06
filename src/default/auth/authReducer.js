export const sesionKey = '_react_client_session'
export const profileKey = '_react_client_profile'
const INITIAL_STATE = JSON.parse(localStorage.getItem(sesionKey)) ? {
    user: JSON.parse(localStorage.getItem(sesionKey)).user,
    token: JSON.parse(localStorage.getItem(sesionKey)).token,
    profile: JSON.parse(localStorage.getItem(profileKey)),
    custom: JSON.parse(localStorage.getItem(sesionKey)).custom,
    profiles: [],
    validToken: false,
    loading: false
} : {
        validToken: false, user: null, token: null, profile: null, profiles: [], entities:[], loading: false, custom: null
    }

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case 'USER_FETCHED':
            if (action.payload.data && action.payload.data.user) {
                localStorage.setItem(sesionKey, JSON.stringify({
                    ...state,
                    user: action.payload.data.user,
                    token: {
                        ...state.token,
                        ...action.payload.data.token
                    },
                    profiles: action.payload.data.profiles,
                    entities: action.payload.data.entities ? action.payload.data.entities : [],
                    profile: null,
                    validToken: true
                }))

                return {
                    ...state,
                    user: action.payload.data.user,
                    token: {
                        ...state.token,
                        ...action.payload.data.token
                    },
                    profiles: action.payload.data.profiles,
                    entities: action.payload.data.entities ? action.payload.data.entities : [],
                    profile: null,
                    validToken: true
                }
            } else if(action.payload.validToken && action.payload.user && action.payload.token) {
                return action.payload
            } else {
                localStorage.removeItem(sesionKey)
                localStorage.removeItem(profileKey)
                return { ...state, validToken: false, user: null, token: null, profile: null, profiles: [], entities:[], custom: null }
            }

        case 'PROFILE_SELECTED':
            localStorage.setItem(profileKey, JSON.stringify(action.payload))
            return { ...state, profile: action.payload }

        case 'USER_CHANGED':
            localStorage.setItem(sesionKey, JSON.stringify({
                ...state,
                user: action.payload
            }))

            return {
                ...state,
                user: action.payload
                }
        
        case 'AUTH_LOADING':
            return { ...state, loading: action.payload !== null ? action.payload : !state.loading }

        case 'AUTH_EXTRA':
            localStorage.setItem(sesionKey, JSON.stringify({
                ...state, 
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