import React, { useState } from 'react'
import styled from 'styled-components'
import { createUserWithEmailAndPassword, firebaseAuth } from './../firebase'
import { doc, setDoc , getFirestore} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

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

function Member() {

  const [name,setName] = useState();
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [nickname,setNickname] = useState();
  const [phone,setPhone] = useState();
  const [error,setError] = useState();
  const navigate = useNavigate();

  const PhoneNumber = (e) =>{
    const value = e.target.value;
    const number = (''+e).replace(/[^0-9]/g, '') 
    const match = number.match(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)

    if(match){
      return match[1] + '-' + match[2] + '-' + match[3]
    }
    return setPhone(value);
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

  const signUp = async (e) =>{
    e.preventDefault();

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
      console.log(error.code)
    }
  }

  return (
    <>
      <Container>
        <SignUp>
          <Title>회원가입</Title>
          {/* {name} {nickname} */}
          {/* {phone} */}
          <InputWrapper>
            <Input defaultValue={name} onChange={(e)=>{setName(e.target.value)}} type="text" className='name' placeholder='이름' />
            <Label>이름</Label>
          </InputWrapper>
          <InputWrapper>
            <Input defaultValue={nickname} onChange={(e)=>{setNickname(e.target.value)}} type="text" className='nickname' placeholder='닉네임' />
            <Label>닉네임</Label>
          </InputWrapper>
          <InputWrapper>
            <Input defaultValue={phone} onChange={PhoneNumber} maxLength={13} type="text" className='phone' placeholder='전화번호' />
            <Label>전화번호</Label>
          </InputWrapper>
          <InputWrapper>
            <Input onChange={(e)=>{setEmail(e.target.value)}} type="email" className='email' placeholder='이메일' />
            <Label>이메일</Label>   
          </InputWrapper>
          <InputWrapper>
            <Input onChange={(e)=>{setPassword(e.target.value)}} type="password" className='password' placeholder='비밀번호' />
            <Label>비밀번호</Label>
          </InputWrapper>
          <InputWrapper>
            <Input type="password" className='confirm_password' placeholder='비밀번호 확인' />
            <Label>비밀번호 확인</Label>
          </InputWrapper>
          <Button onClick={signUp}>가입</Button>
          <p>{error}</p>
        </SignUp>
      </Container>
    </>
  )
}

export default Member