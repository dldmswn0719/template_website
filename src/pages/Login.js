import React, { useState } from 'react'
import styled from 'styled-components'
import {GoogleAuthProvider,GithubAuthProvider,signInWithPopup,createUserWithEmailAndPassword, firebaseAuth, signInWithEmailAndPassword } from '../firebase'
import {NavLink, useNavigate} from "react-router-dom";
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { logIn, loggedIn } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';


const Container = styled.div`
  display: flex;
  background-color: #f5f5f5;
  justify-content: center;
  height: calc(100vh - 86px);
  /* 스크롤생기는거 때문에 */
  align-items: center;
`

const SignUp = styled.div`
  width: 35vw;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  background-color: #fff;
  border-radius: 10px;
  @media screen and (max-width: 640px){
    width: 70vw;
  }
  @media screen and (max-width: 1024px){
    width: 60vw;
  }
`

const Title = styled.h1`
  font-size: 24px;
  text-align: center; margin-bottom: 20px;
`

const Input = styled.input`
  width: 100%; padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  padding-left: 45px;
  transition: border-color 0.4s;
  &:focus{
    border-color: #ee9191;
    outline: none;
  }
  //클릭했을때 보더 색깔 바뀜, outline 넣으면 색깔만 들어올거임
  &::placeholder{opacity: 0;}
  //이메일,비밀번호 안보임
`

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  &:last-child{
    margin-bottom: 0; margin-top: 20px;
    justify-content: flex-end; display: flex;
    column-gap: 20px;
    a{
      background-color: #f1a7a7;
      font-size: 14px;
      text-align: center;
      padding: 5px 20px;
      border-radius: 5px;
      color: white;
      &:last-child{
        background-color: #f18e8e;
      }
    }
  }
  input:focus + label,
  input:not(:placeholder-shown) + label{
  //안에 내용적으면(없다면 적용x) 글자 다시 내려오지말고 유지
    top: 4px;
    left: 4px;
    font-size: 8px;
    color:  #ee9191;
  }
  // 클릭하면 왼쪽 위로 색깔 생기면서 올라감
`

const Label = styled.label`
  position: absolute;
  top: 10px; left: 10px;
  font-size: 14px; color: #999;
  transition: all 0.3s;
  pointer-events: none;
`

const Button = styled.button`
  width: 100%; padding: 10px;
  border-radius: 5px;
  background-color: #eb7a7a;
  border: none;
  color: #fff;
  cursor: pointer;
`

const SnsButton = styled.button`
  display: flex;
  align-items: center; padding: 8px 12px;
  border: none; border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.$bgColor || `gray`};
  color : ${props => props.color || 'white'};
  font-size: 16px; width: 50%;
  transition: 0.3s;
  &:hover{
    background-color : ${props => props.$hoverBgColor || '#666'};
  }
  svg{
    margin-right: 8px;
  }
`

function Login() {

  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [error,setError] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user)
  console.log(userState)

  const errorMsg = (errorCode) =>{
    const firebaseError = {
      "auth/user-not-found" : "이메일 혹은 비밀번호가 잘못 되었습니다.",
      "auth/wrong-password" : "이메일 혹은 비밀번호가 잘못 되었습니다.",
      "auth/invalid-email" : "이메일 혹은 비밀번호가 잘못 되었습니다."
    }
    return firebaseError[errorCode] || "알 수 없는 에러가 발생했습니다"
    //errorCode 반환
  }

  const LoginForm = async (e) =>{
    // async 함수내에서 사용할수있는 것, function 앞에 써야함,무언가 준비한다라는뜻 , 성공과 실패는 try,catch/ 오류가 있을수있지만 try실행해주세요, 만약에 오류가 있다면 catch 실행해주세요
    e.preventDefault();
    try{
      const userLogin = await signInWithEmailAndPassword(firebaseAuth,email,password)
      // console.log(userLogin)
      //await는 async안에서만 사용가능
      const user = userLogin.user
      console.log(user)
      //user정보만출력 다른정보는 안나옴

      sessionStorage.setItem("users", user.uid)
      dispatch(logIn(user.uid))

      const userDoc = doc(collection(getFirestore(),"users"),user.uid);
      const userDocSnapshot = await getDoc(userDoc);
      if(userDocSnapshot.exists()){
        const userData = userDocSnapshot.data();
        dispatch(loggedIn(userData));
        navigate(-1)
      }
      console.log(userDocSnapshot.data())

    }catch(error){
      setError(errorMsg(error.code));
      console.log(error.code)
    }
  }

  const snsLogin = async (data) =>{
    // alert(data)
    let provider;
    switch(data){
      case 'google' : 
        provider = new GoogleAuthProvider();
      break;

      case 'github' : 
        provider = new GithubAuthProvider();
      break;

      default:
        return;
    }

    try{  
      const result = await signInWithPopup(firebaseAuth,provider)
      const user = result.user
      console.log(user)
      sessionStorage.setItem("users",user.uid)
      dispatch(logIn(user.uid))
      navigate("/member" ,{
        state:
        {
          nickname : user.displayName,
          email : user.email
          // photoURL : user.photoURL
        }
      })
    }catch(error){
      setError(errorMsg(error))
    }
  }


  return (
    <>
      <Container>
        <SignUp>
          <Title>로그인</Title>
          {email} {password}
          <form onSubmit={LoginForm}>
            <InputWrapper>
              <Input type="email" className='email' placeholder='이메일' onChange={(e)=>setEmail(e.target.value)} required/>
              {/* onchange 넣으면 실시간으로 변함 이메일 위에 적은게 뜬다 */}
              <Label>이메일</Label>
            </InputWrapper>
            <InputWrapper>
              <Input type="password" className='password' placeholder='비밀번호' onChange={(e)=>setPassword(e.target.value)} required/>
              <Label>패스워드</Label>
            </InputWrapper>
            <Button>로그인</Button>
          </form>
          <p>{error}</p>
          <InputWrapper>
            <NavLink to="/findemail">이메일 찾기 / 비밀번호 재설정</NavLink>
            <NavLink to="/member">회원가입</NavLink>
          </InputWrapper>
          <InputWrapper>
            <SnsButton onClick={()=>{snsLogin('google')}} $bgColor="#db4437"  $hoverBgColor="#b33225">
              <FontAwesomeIcon icon={faGoogle} /> Login with Google
            </SnsButton>
            <SnsButton onClick={()=>{snsLogin('github')}} $bgColor="#333" $hoverBgColor="111">
              <FontAwesomeIcon icon={faGithub} /> Login with Github
            </SnsButton>
          </InputWrapper>
        </SignUp>
      </Container>
    </>
  )
}
export default Login