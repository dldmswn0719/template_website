import React from 'react'
import {Swiper , SwiperSlide} from 'swiper/react'
import {Navigation, Autoplay, Pagination} from'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styled from 'styled-components'

const StyleSlide = styled(SwiperSlide)`
position: relative;
img{width: 100%; height:auto;}
`
// SwiperSlide css적용하고싶다면 이렇게 쓰기 , 물론 밑에 태그도 바꿔줘야함(SwiperSlide 에서 StyleSlide로)

const DescContent = styled.div`
position: absolute;
left: 50%; top: 50%;
transform: translate(-50%,-50%);
color: white;
h3{
    text-align: center;
    font-size: 48px;
    @media screen and (max-width : 768px){
        font-size: 16px;
    }
    @media screen and (max-width : 1280px){
        font-size: 30px;
    }
}
p{
    font-size: 24px;
    text-align: center; font-weight: bold;
    @media screen and (max-width : 768px){
        font-size: 14px;
    }
    @media screen and (max-width : 1280px){
        font-size: 20px;
    }
}
`

function Banner() {
  return (
    <>    
        <Swiper
        autoplay={{
        delay:3000,
        disableOnInteraction:false
        }}
        //3초마다 자동재생
        loop={true}
        // 무한루프
        slidesPerView={1}
        // 한 화면에 보이는 슬라이드갯수
        navigation={{clickable:true}}
        pagination={{clickable:true}}
        modules={[Autoplay,Navigation,Pagination]}
        >
        {
        Array(5).fill().map((_,i)=>{
            return(
            <StyleSlide key={i}>
                <img src={`./images/img${i+1}.${i===1 || i===2 ? 'png' : 'jpg'}`} alt="slide" />
                <DescContent>
                    <h3>강조하는 제목 {i}</h3>
                </DescContent>    
            </StyleSlide>
            )
        })
        }     
    </Swiper>
        {/* <Swiper>
        <SwiperSlide>
            <img src="./images/img1.jpg" alt="slide" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="./images/img2.png" alt="slide" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="./images/img3.png" alt="slide" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="./images/img4.jpg" alt="slide" />
        </SwiperSlide>
        <SwiperSlide>
            <img src="./images/img5.jpg" alt="slide" />
        </SwiperSlide>
        </Swiper> */}
    </>
  )
}

export default Banner