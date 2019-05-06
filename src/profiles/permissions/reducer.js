import _ from 'lodash'

const INITIAL_STATE = { list: [], selected: {} }

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'PERMISSIONS_FETCHED':
            return { ...state, list: action.payload }

        case 'PERMISSION_FORM_SHOWED':
            return { ...state, show: action.payload }

        case 'PERMISSION_SELECTED':
            return { ...state, selected: action.payload }

        case 'PERMISSION_CHANGED':
            let list = state.list
            let i = _.findIndex(list[state.selected].actions, { noun: action.payload.noun })

            list[state.selected].actions[i] = {
                ...list[state.selected].actions[i],
                code: list[state.selected].actions[i].code + action.payload.newCode
            }
            return { ...state, list: [...list] }

        default:
            return state;
    }


}