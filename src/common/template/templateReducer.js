const INITIAL_STATE = { sideBarOpened: false, notifications: [] }

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SIDE_BAR_OPENED':
            return { ...state, sideBarOpened: !state.sideBarOpened }

        case 'SIDE_BAR_STATUS':
            return { ...state, sideBarOpened: action.payload }

        case 'NOTIFICATIONS_FETCHED':
            return { ...state, notifications: action.payload.data ? action.payload.data.data : [] }

        case 'NOTIFICATIONS_CLEANED':
            return { ...state, notifications: [] }
            
        default:
            return state;
    }
}