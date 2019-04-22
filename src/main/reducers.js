import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'

import TabReducer from '../common/tab/tabReducer'
import AuthReducer from '../auth/authReducer'
import BillingCycleReducer from '../billingCycle/billingCycleReducer'
import UserReducer from '../users/reducer'

const rootReducer = combineReducers({
    tab: TabReducer,
    auth: AuthReducer,
    form: formReducer,
    toastr: toastrReducer,
    billingCycle: BillingCycleReducer,
    user: UserReducer
})

export default rootReducer