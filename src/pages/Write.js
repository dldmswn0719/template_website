import React from 'react'
import styled from 'styled-components';
import Ckeditor from '../components/Ckeditor';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from '../components/Modal'

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 60px;
`;

const InnerContainer = styled.div`
  margin: 0 4px;
  max-width: 1280px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const Heading = styled.h3`
  font-size: 30px;
  position: relative;

  &::after {
    content: '';
    width: 65px;
    height: 5px;
    margin-left: 0.5px;
    background-color: #f8d3d3;
    position: absolute;
    top: -6px;
    left: 0;
    border-radius: 10px;
  }
`;

const ContentWrapper = styled.div`
  width: auto;
  height: auto;
  margin-top: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding-right: 50px;
`;

const ContentInner = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-top: 10px;
`;

const TextInput = styled.input`
  height: 40px;
  border: 1px solid #e5e7eb;
  flex-basis: 75%;
`;

const ContentInputWrapper = styled.div`
  width: auto;
  margin-top: 20px;
  margin-left: 70px;
`;

const ContentLabel = styled.p`
  margin-bottom: 15px;
`;

function Write() {

  const [txtTitle,setTxtTitle] = useState("");
  const {board} = useParams()
  // alert(board) write/service 썻다면 알림창 service나올거임

  const boards = ["notice" , "online" , "qna" , "gallery"];
  const [isModal,setIsModal] = useState(true);
  const navigate = useNavigate();
  const memberProfile = useSelector(state => state.user);
  // 이게시판은 회원이 로그인하지않으면 이용하지 못하게 만든것
  // console.log(memberProfile)

  if(!memberProfile.loggedIn){
    return(
      <>
        {
          isModal && <Modal error="로그인 이후 이용해주시길 바랍니다." onClose={()=>{setIsModal(false); navigate('/login')}} />
        } 
      </>
    )
  }
  //로그인상태가 아니라면! http://localhost:3000/write/online 로그인으로 튕길거임

  if(!boards.includes(board)){
    return(
      <>
        {
          isModal && <Modal error="잘못된 경로입니다!" onClose={()=>{setIsModal(false); navigate('/')}} />
        } 
      </>
    )
  }

  return (
    <Container>
      <InnerContainer>
        <Header>
          <Heading>글쓰기</Heading>
        </Header>
        <ContentWrapper>
          <ContentInner>
            <Title>제목</Title>
            <TextInput type="text" onChange={(e)=>{setTxtTitle(e.target.value)}} />
          </ContentInner>
          <ContentInputWrapper>
            <ContentLabel>내용</ContentLabel>
            <Ckeditor title={txtTitle} />
          </ContentInputWrapper>
        </ContentWrapper>
      </InnerContainer>
    </Container>
  );
}


export default Write;