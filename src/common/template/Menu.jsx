import React from 'react'

import MenuItem from './MenuItem'
import MenuTree from './MenuTree'

export default props => (
    <ul className='sidebar-menu'>
        <MenuItem path='/' label='Dashboard' icon='dashboard' />
        <MenuItem path='users' label='Usuários' icon='user' />
        <MenuItem path='profiles' label='Perfis' icon='users' />
        {/* <MenuTree label='Cadastro' icon='edit'>
        <MenuItem path='billingCycles' label='Ciclos de Pagamentos' icon='usd' />
        </MenuTree> */}
    </ul>
)