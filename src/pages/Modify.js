import React from 'react'
import { useSelector } from 'react-redux'
import Modal from '../components/Modal'
import { useNavigate } from 'react-router-dom'

function Modify() {

  const userState = useSelector(state => state.user)
  // console.log(userState.loggedIn)
  const navigate = useNavigate();

  return (
    <>
      {
        userState.loggedIn ? <div>Modify</div> :
       <Modal error="로그인이 필요한 페이지입니다." onClose={()=>{navigate('/login')}} />
      }
    </>
  )
}

export default Modify