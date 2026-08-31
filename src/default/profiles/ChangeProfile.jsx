import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import '../auth/auth.css'
import { selectProfile } from '../auth/authActions'

const ChangeProfile = (props) => {
  return (
    <div style={{ alignItems: 'center', background: '#e9ecef', display: 'flex', justifyContent: 'center', height: '90vh' }}>
      <div className="login-box">
        <div className="card">
          <div className="card-body login-card-body col-xs-12">
            <p className="login-box-msg">Selecione um perfil</p>
            <ul className='list-group custom-list-group'>
              {props.profiles.map(profile => (
                <a key={profile.id} href="#!" className=' text-center col-xs-12'
                  onClick={() => props.selectProfile(profile, props.token)}>
                  <li className='list-group-item col-xs-12'>
                    <b>{profile.noun}</b>
                  </li>
                </a>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = state => ({
  profiles: state.auth.profiles,
  profile: state.auth.profile,
  token: state.auth.token
})
const mapDispatchToProps = dispatch => bindActionCreators({ selectProfile }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ChangeProfile)
