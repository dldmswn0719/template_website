import {Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Member from "./pages/Member";
import Login from "./pages/Login";
import GlobalStyle from "./components/GlobalStyle";
import Aside from "./components/Aside";
import Nav from "./components/Nav";
import store from "./store";
import { ThemeProvider } from "styled-components";
import { Provider, useSelector } from "react-redux";
import Example from "./example/Example";
import Logout from "./pages/Logout";


function App() {

  // console.log(process.env)

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
  const userState = useSelector(state => state.user)
  console.log(userState)

  return(
    <ThemeProvider theme={DarkMode}>
      {/* {theme} */}
      <GlobalStyle />
      <Aside />
      <Nav />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/member" element={<Member />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/example" element={<Example />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App;
