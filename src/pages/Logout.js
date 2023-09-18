import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logOut } from '../store'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { firebaseAuth } from '../firebase'
import Modal from '../components/Modal'

function Logout() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    signOut(firebaseAuth)
    .then(()=>{
        dispatch(logOut());
        // navigate("/");
        sessionStorage.removeItem("users")
    })
    .catch((error)=>{
        console.log(error)
    })

    const [isModal,setIsModal] = useState(true);
    // 기본적으로 화면에 나와야하기때문에 true값으로

    return (
        <>
            {
                <Modal error="로그아웃 하시겠습니까?" onClose={()=>{setIsModal(false); navigate("/"); }} /> 
                // 다른컴포넌트에서는 직접적인 onclick을 사용할수없다.
            }
        </>
    )
}

export default Logout