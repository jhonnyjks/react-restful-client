const INITIAL_STATE = {list: [], show: 'list'}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'USERS_FETCHED':
            return {...state, list: action.payload.data.data}

        case 'FORM_SHOWED':
            return {...state, show: action.payload}

        default:
            return state;
    }
}