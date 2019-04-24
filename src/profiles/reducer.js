const INITIAL_STATE = {list: [], show: 'list'}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'PROFILES_FETCHED':
            return {...state, list: action.payload.data ? action.payload.data.data : []}

        case 'PROFILE_FORM_SHOWED':
            return {...state, show: action.payload}

        default:
            return state;
    }
}