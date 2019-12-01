import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import {reducer as toastrReducer} from 'react-redux-toastr'

import TabReducer from '../common/layout/tab/tabReducer'
import TemplateReducer from '../common/template/templateReducer'
import { reducers as DefaultReducers } from '../default'
import { reducers } from '../app/exports'

const rootReducer = combineReducers({
    tab: TabReducer,
    form: formReducer,
    toastr: toastrReducer,
    template: TemplateReducer,
    ...DefaultReducers,
    ...reducers // Reducers do projeto filho
})

export default rootReducer