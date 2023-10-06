import React from 'react'
import Banner from '../components/Home/Banner'
import Company from '../components/Home/Company'
import Content from '../components/Home/Content'
import Management from '../components/Home/Management'
import Different from '../components/Home/Different'
 
// import React, { useEffect, useState } from 'react'
// import Product from './Product'
// import { useMemo } from 'react'
  // import { useDispatch, useSelector } from 'react-redux'
  // import { changeName } from '../store'

  // const Test = () =>{
  //   return(
  //     // <p>테스트</p>
  //     console.log("계속 실행됨")
  //   )
  // }

function Main() {
  // const a = useSelector(state => state.user)
  // console.log(a)

  // const id = useSelector(state => state.id)
  // const dispatch = useDispatch()

  // const result = useMemo(()=>{
  //   return Test()
  // },[]) //[]를 써서 필요할때만 바꿀수있다
  // //useEffect 는 마운트 되었을때 , useMemo는 마운트 되기 직전에 실행

  // useEffect(()=>{
  //   console.log("완료!")

  //   return ()=>{
  //     console.log("완료가 되기전 실행됨")
  //   } //언마운트될때 실행 , 컴포넌트가 벗어날때 실행 (타이머 일떄 실행,타이머를 제거해주고 실행)

  // },[])//마운트 되었을때만 실행, 업데이트 제거 [] 딱 한번만 실행
  // //마운트가 되었을때 실행, 업데이트가 되었을때도 실행


  // let [count,setCount] = useState(0)

  return (
    <>
      <Banner />
      <Company />
      <Content />
      <Different />
      <Management />
      {/* {result}
      <p>{count}</p>
      <Product />
      <button onClick={()=>{setCount(count+1)}}>버튼</button> */}
      {/* <p>{a}</p>
      <p>{id}</p>
      <button onClick={()=>{dispatch(changeName())}}>변경</button> */}
    </>
  )
}

export default Main