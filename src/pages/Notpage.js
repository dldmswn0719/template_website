import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Page = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #f6f6f6;
    left: 0; top: 0; z-index: 9999;
    display: flex;  justify-content: center;
    align-items: center; padding: 0 2%;
    box-sizing: border-box;
`

const PageContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    line-height: 1.4;
    padding: 40px;
    background-color: #fff;
    border-radius: 10px;
    width: 100%;
    box-sizing: border-box;
    -webkit-box-shadow: 0 15px 15px -10px rgba(0,0,0,0.1);
    /* 크로스 브라우징 영향 shadow 적을때는 같이 적기 */
    box-shadow: 0 15px 15px -10px rgba(0,0,0,0.1);
    text-align: center;
    h3{
        font-size: 165px;
        font-weight: bold;
        margin-bottom: 50px;
        color: #262626;
        span{
            color: pink;
        }
    }
    p{
        margin-bottom: 20px;
        font-size: 40px;
        font-weight: bold;
        span{
            color: red;
        }
    }
`

const Button = styled.button`
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 10px 30px;
    border-radius: 5px;
    cursor: pointer;
`

function Notpage() {

    const navigate = useNavigate();
    const [countDown,setCountDown] = useState(5);

    useEffect(()=>{
        if(countDown > 0){
            const timer = setTimeout(()=>{
                setCountDown(countDown-1)
            },1000)
            
            return ()=> clearTimeout(timer);

        }else{
            navigate("/")
            // 0이라면 메인으로 이동
        }
    },[countDown,navigate])
    // countDown 이 바뀔때 마다 재실행/ 로딩되었을때기 때문에 useEffect 사용

    return (
        <>
            <Page>
                <PageContent>
                    <h3>4<span>0</span>4</h3>
                    <p>페이지를 찾을 수 없습니다.</p>
                    <p>주소를 다시 한번 확인해주세요.</p>
                    <p><span>{countDown}</span>초 후에 이동 됩니다.</p>
                    <Button onClick={()=>navigate('/')}>메인으로 가기</Button>
                </PageContent>
            </Page>
        </>
    )
}

export default Notpage