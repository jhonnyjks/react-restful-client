const INITIAL_STATE = { sideBarOpened: false }

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SIDE_BAR_OPENED':
            return { ...state, sideBarOpened: !state.sideBarOpened }
        case 'SIDE_BAR_STATUS':
            return { ...state, sideBarOpened: action.payload }
        default:
            return state;
    }
}