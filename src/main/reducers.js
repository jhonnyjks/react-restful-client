import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'

import TabReducer from '../common/layout/tab/tabReducer'
import TemplateReducer from '../common/template/templateReducer'
import AuthReducer from '../default/auth/authReducer'
import UserReducer from '../default/users/reducer'
import ProfileReducer from '../default/profiles/reducer'
import PermissionReducer from '../default/profiles/permissions/reducer'
import { reducers } from '../app/exports'

const rootReducer = combineReducers({
    tab: TabReducer,
    auth: AuthReducer,
    form: formReducer,
    toastr: toastrReducer,
    user: UserReducer,
    profile: ProfileReducer,
    permission: PermissionReducer,
    template: TemplateReducer,
    ...reducers // Reducers do projeto filho
})

export default rootReducer