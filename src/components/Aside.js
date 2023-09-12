import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { styled } from 'styled-components'
import { toggleTheme } from '../store'
import { useDispatch, useSelector } from 'react-redux'

const ASide = styled.div`
        position: fixed;
        right: 20px;
        bottom: 20px;
        border: 1px solid #ddd;
        background-color: ${({$isdark})=>($isdark === 'light' ? "#fff" : "#333")}; 
        color: ${({$isdark})=>($isdark === "light" ? "#000" : "#d9d9d9")};   
        border-radius: 5px;
        cursor: pointer;
        width: 50px; height: 50px;
        line-height: 50px; text-align: center;
        /* svg{
            color: ${({$isdark})=>($isdark === "light" ? "#000" : "#d9d9d9")}; 
        } */
    `
    
function Aside() {
    const theme = useSelector(state => state.dark)
    const dispatch = useDispatch()

    return (
    <ASide $isdark={theme} onClick={()=>{dispatch(toggleTheme())}}>
        <FontAwesomeIcon $isdark={theme} icon = {theme === 'light' ? faSun : faMoon} size="lg" />
    </ASide>
  )
}

export default Aside