import User from '../default/users/index'
import Profile from '../default/profiles/index'

import AuthReducer from './auth/authReducer'
import UserReducer from './users/reducer'
import ProfileReducer from './profiles/reducer'
import PermissionReducer from './profiles/permissions/reducer'
import { userProfileReducer } from './users/userProfile.duck'

// Reducers do projeto
export const reducers = {
    auth: AuthReducer,
    user: UserReducer,
    profile: ProfileReducer,
    permission: PermissionReducer,
    userProfile: userProfileReducer
}

// Rotas do projeto
export const routes = [
    { exact: true, path: '/users', component: User },
    { exact: true, path: '/profiles', component: Profile }
]

// Menu do projeto
export const menu = {
    '/': { title: 'Dashboard', icon: 'tachometer-alt' },
    '/users': { title: 'Usuários', icon: 'user' },
    '/profiles': { title: 'Perfis', icon: 'user' }
    // 'profiles': {
    //     title: 'Perfis', icon: 'users',
    //     //Exemplo de menu cascateado
    //     children: {
    //         '/profiles': { title: 'Permissões', icon: 'user' },
    //     }
    // }
}