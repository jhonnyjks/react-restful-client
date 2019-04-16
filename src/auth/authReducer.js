const sesionKey = '_react_client_session'
const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem(sesionKey)) ? JSON.parse(localStorage.getItem(sesionKey)).user : null,
    token: JSON.parse(localStorage.getItem(sesionKey)) ? JSON.parse(localStorage.getItem(sesionKey)).token : null,
    validToken: false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'TOKEN_VALIDATED':
            if(action.payload) {
                return { ...state, validToken: true }
            } else {
                localStorage.removeItem(sesionKey)
                return { ...state, validToken: false, user: null, token: null }
            }
        case 'USER_FETCHED':
            localStorage.setItem(sesionKey, JSON.stringify({ 
                user: action.payload.data.user,
                token: action.payload.data.token
            }))
            return { ...state, user: action.payload.data.user, token: action.payload.data.token, validToken: true }
        default:
            return state
    }
}