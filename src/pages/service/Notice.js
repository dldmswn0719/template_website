import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const BoardWrapper = styled.div`
  max-width: 1000px;
  margin: 50px auto;
`

const Title = styled.div`
  padding: 10px 20px; font-weight: bold; font-size: 24px;
`

const List = styled.ul`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
`

const ListItem = styled.li`
  padding: 10px 20px;
  text-align: center;
  flex-basis: 10%;
  &:nth-child(2){flex-basis: 50%;} //제목
  &:nth-child(3){flex-basis: 20%;} //작성자
  &:nth-child(4){flex-basis: 20%;} //작성일
`

const ButtonWrap = styled.div`
    display: flex;
    justify-content: flex-end;
`

const Button = styled.div`
    border-radius: 0.5rem;
    margin: 20px 0px;
    background-color: #eb7a7a;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: bold;
    color: white;
    display: flex; align-items: center;
    outline: none; border: none;
    cursor: pointer;
    &:nth-child(1){
        background-color: #f1a7a7;
    }
    a{color : white;}
    svg{margin-right: 12px;}
`

function Notice() {

  const [posts,setPosts] = useState([]);
  useEffect(()=>{

    const fetchPosts = async () =>{

      try{
        
        const q = query(collection(getFirestore(),'notice'),orderBy("timestamp","desc"));
        //desc = 최신순(내림차순) / asc = 오름차순
        const snapShot = await getDocs(q);
        // 데이터 가져오는건 무조건 snapShot
        // console.log(snapShot)
        const postArray = snapShot.docs.map(doc => ({id : doc.id, ...doc.data()}));
        setPosts(postArray)
        // console.log(postArray)

      }catch(error){
        // console.log(error);
      }

    }
    fetchPosts()

  },[])
  
  if(posts.length === 0){
    return <div>로딩중</div>
  }
  //값이 없다면 로딩중이라고 뜬다

  return (
      <>
        <BoardWrapper>
          <Title>공지사항</Title>
          <List>
            <ListItem>번호</ListItem>
            <ListItem>제목</ListItem>
            <ListItem>작성자</ListItem>
            <ListItem>작성일</ListItem>
            <ListItem>조회수</ListItem>
          </List>
          {
            posts.map((e,i)=>{
              return(
                <List key={i}>
                  <ListItem>{posts.length - i}</ListItem>
                  {/* 역순 : 최대갯수 - 인덱스 값 */}
                  <ListItem><Link to={`/view/notice/${e.id}`}>{e.title}</Link></ListItem>
                  {/* Link to 하면 클릭하는 이벤트로 바뀐다 / 클릭시 주소가 생긴다*/}
                  <ListItem>{e.nickname}</ListItem>
                  <ListItem>{e.timestamp.toDate().toLocaleDateString()}</ListItem>
                  <ListItem>{e.view}</ListItem>
                </List>
              )
            })
          }
          <ButtonWrap>
            <Button><Link to="/write/notice"><FontAwesomeIcon icon={faPen} />글쓰기</Link></Button>
          </ButtonWrap>
        </BoardWrapper>  
      </>
    )
}

export default Notice