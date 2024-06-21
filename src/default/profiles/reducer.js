const INITIAL_STATE = {
    list: [], 
    show: 'list', 
    errors: {},
    pagination: {
        current_page: null,
        last_page: null,
        total: null,
    }
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'PROFILES_FETCHED':
            const responseData = action.payload.data && action.payload.data.data
                ? (action.payload.data.data.data || action.payload.data.data)
                : [];
            
            const paginationData = action.payload.data.data

            return { 
                ...state, 
                list: responseData,
                pagination: {
                    current_page: paginationData.current_page,
                    last_page: paginationData.last_page,
                    total: paginationData.total,
                    to: paginationData.to,
                }
            };

        case 'PROFILE_CONTENT_CHANGED':           
            return {...state, show: action.payload}

        default:
            return state;
    }
}