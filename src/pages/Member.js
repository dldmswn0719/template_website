import React, { useState } from 'react'
import styled from 'styled-components'
import { createUserWithEmailAndPassword, firebaseAuth } from './../firebase'
import { doc, setDoc , getFirestore} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import Modal from '../components/Modal'


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
  &:focus{
    border-color: #ee9191;
    outline: none;
  }
  &::placeholder{opacity: 0;}
`

const InputWrapper = styled.div`
  position: relative;
  input:focus + label,
  input:not(:placeholder-shown) + label{
    top: 4px;
    left: 4px;
    font-size: 10px;
    color:  #ee9191;
  }
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

const Password = styled.div`
  position: relative;
  width: 100%;
  svg{
    position: absolute;
    right: 10px;
    top: 12.5px;
    cursor: pointer;
  }
`

function Member() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [passwordConfirm,setPasswordConfirm] = useState("");
  const [nickname,setNickname] = useState("");
  const [phone,setPhone] = useState("");
  const [error,setError] = useState("");
  const [eye,setEye] = useState([0,0]);
  const [isModal,setIsModal] =useState(false);
  const navigate = useNavigate();

  const toggleEye = (index) =>{
    const newEye = [...eye];
    //0,0이 복사된다 0번은 false 1이 true
    //원래 있던 eye의 배열값을 복사해 배열을 벗긴다.
    //[[0,0]] > [] 없애는게 ... 표현 > 다시 말해서 값은값이 복사가 된다.
    newEye[index] = !newEye[index];
    //eye를 첫번째를 클릭했다면 newEye[0] = 부정 즉 false > true로 변경된다.[1,0]
    setEye(newEye)
    //그리고 그 값을 쓰기 전용인 setEye에 새로운 배열값을 저장한다.
  }

  const PhoneNumber = (e) =>{
    let value = e.target.value;
    e.target.value = e.target.value.replace(/[^0-9]/g, '').replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/-{1,2}$/g, "");

    setPhone(value);
  }

  const errorMsg = (errorCode) =>{
    const firebaseError = {
      "auth/admin-restriced-operation" : "빈칸이 있습니다.",
      "auth/email-already-in-use" : "이미 사용중인 이메일입니다.",
      "invalid-argument" : "빈칸이 있습니다.",
      "auth/invalid-email" : "유효하지 않은 이메일 주소입니다",
      "auth/operation-not-allowed" : "이메일/비밀번호 계정이 비활성화 되어 있습니다",
      "auth/weak-password" : "비밀번호 6자리이상 설정해주세요."
    }
    return firebaseError[errorCode] || "알 수 없는 에러가 발생하였습니다."
  }

  const isValidPhone = (phone) =>{
    const regex = /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/;
    return regex.test(phone)
    //정규식 코드에 일치하는지 true,false값이 나올거임
  }

  const isValidEmail = (email) =>{
    const regex = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/
    return regex.test(email)
  }

  const signUp = async (e) =>{
    e.preventDefault();

    let errorMessage = "";

    if(name.length === 0){
      errorMessage = "이름"
    }else if(nickname.length === 0){
      errorMessage = "닉네임";
    }else if(!isValidPhone(phone)){
      setError("유효한 전화번호를 입력해주세요.");
      setIsModal(!isModal);
      //isModal 자체를 true 로 만들어서 실행
      return;
    }else if(!isValidEmail(email)){
      setError("유효한 이메일 주소를 입력해주세요.");
      setIsModal(!isModal);
      return;
    }else if(password.length === 0){
      errorMessage = "비밀번호";
    }else if(passwordConfirm.length === 0){
      errorMessage = "비밀번호 확인"
    }else if(password !== passwordConfirm){
      setError("비밀번호가 일치하지 않습니다");
      setIsModal(!isModal);
      return;
    }

    if(errorMessage){
      setError(errorMessage + "이(가) 비어 있습니다.");
      setIsModal(!isModal);
      return;
    }

    try{
      const { user } = await createUserWithEmailAndPassword(firebaseAuth,email,password);

      const userProfile = {
        name,
        nickname,
        phone
      }

      await setDoc(doc(getFirestore(),"users",user.uid),userProfile)

      alert("회원가입이 완료 되었습니다.")
      navigate('/');

    }catch(error){
      setError(errorMsg(error.code))
      setIsModal(!isModal);
      console.log(error.code)
    }
  }

  return (
    <>
      {
        isModal &&
        //isModal이 true일때만 보여주세요 값이 있거나 참일때만 보여줌
        <Modal error={error} onClose={()=>{setIsModal(false)}} />
      }
      <Container>
        <SignUp>
          <Title>회원가입</Title>
          {/* {name} {nickname} */}
          {/* {phone} */}
          <InputWrapper>
            <Input value={name} onChange={(e)=>{setName(e.target.value)}} type="text" className='name' placeholder='이름' />
            <Label>이름</Label>
          </InputWrapper>
          <InputWrapper>
            <Input value={nickname} onChange={(e)=>{setNickname(e.target.value)}} type="text" className='nickname' placeholder='닉네임' />
            <Label>닉네임</Label>
          </InputWrapper>
          <InputWrapper>
            <Input onInput={PhoneNumber} maxLength={13} type="text" className='phone' placeholder='전화번호' />
            <Label>전화번호</Label>
          </InputWrapper>
          <InputWrapper>
            <Input onChange={(e)=>{setEmail(e.target.value)}} type="email" className='email' placeholder='이메일' />
            <Label>이메일</Label>   
          </InputWrapper>
          <Password>
            <InputWrapper>
              <Input onChange={(e)=>{setPassword(e.target.value)}} type={eye[0] ? 'text' : 'password'} className='password' placeholder='비밀번호' />
              <Label>비밀번호</Label>
              <FontAwesomeIcon icon={eye[0] ? faEye : faEyeSlash} onClick={()=>{toggleEye(0)}}/>
            </InputWrapper>
          </Password>
          <Password>
            <InputWrapper>
              <Input onChange={(e)=>{setPasswordConfirm(e.target.value)}} type={eye[1] ? 'text' : 'password'} className='confirm_password' placeholder='비밀번호 확인' />
              <Label>비밀번호 확인</Label>
              <FontAwesomeIcon icon={eye[1] ? faEye : faEyeSlash} onClick={()=>{toggleEye(1)}} />
            </InputWrapper>
          </Password>
          <Button onClick={signUp}>가입</Button>
          {/* <p>{error}</p> */}
        </SignUp>
      </Container>
    </>
  )
}

export default Member