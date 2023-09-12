import {Route, Routes } from "react-router-dom";
import GlobalStyle from "./components/GlobalStyle";
import Main from "./pages/Main";
import Aside from "./components/Aside";
import { ThemeProvider } from "styled-components";
import { useState } from "react";
import Nav from "./components/Nav";
import store from "./store";
import { Provider, useSelector } from "react-redux";


function App() {

  return (
    <>
    <Provider store={store}>
      <Inner />
    </Provider>
    </>
  );
}

function Inner(){

  const light = {
    colors : {
      Primary : "#f8d3d3",
      Secondary : "#f1a7a7",
      BgColor : "#e9f1f6",
      Color : "#000",
      ContentBg : "#fff"
    }
  }
  
  const dark = {
    colors : {
      Primary : "#272929",
      Secondary : "e9e9e9",
      BgColor : "#333",
      Color : "#e9e9e9",
      ContentBg : "#272929"
    }
  }

  const theme = useSelector(state => state.dark)
  const DarkMode = theme === 'light' ? light : dark;

  return(
    <ThemeProvider theme={DarkMode}>
      {theme}
      <GlobalStyle />
      <Aside />
      <Nav />
      <Routes>
        <Route path="/" element={<Main />}></Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App;
