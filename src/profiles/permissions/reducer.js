const INITIAL_STATE = {list: [], selected: {}}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'PERMISSIONS_FETCHED':
            return {...state, list: action.payload.data ? action.payload.data.data : []}

        case 'PERMISSION_FORM_SHOWED':
            return {...state, show: action.payload}
        
        case 'PERMISSION_SELECTED':
            return { ...state, selected: action.payload }

        default:
            return state;
    }
}