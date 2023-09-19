import {Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Member from "./pages/Member";
import Login from "./pages/Login";
import GlobalStyle from "./components/GlobalStyle";
import Aside from "./components/Aside";
import Nav from "./components/Nav";
import store, { loggedIn } from "./store";
import { ThemeProvider } from "styled-components";
import { Provider, useDispatch, useSelector } from "react-redux";
import Example from "./example/Example";
import Logout from "./pages/Logout";
import { useEffect } from "react";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import Modify from "./pages/Modify";
import Findemail from "./pages/Findemail";


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

  const dispatch = useDispatch();
  const uid = sessionStorage.getItem("users")
  console.log(uid)
  //콘솔창에 내 uid값 나온다

  useEffect(()=>{

    const fetchUser = async () =>{
      if(!uid) return;
      //만약에 uid값이 없다면 return 시킬거임

      const userDoc = doc(collection(getFirestore(),"users"),uid);
      console.log(userDoc)

      try{
          //실패할수도있다 ,성공했을때
          const docSnapshot = await getDoc(userDoc);
          console.log(docSnapshot)
          if(docSnapshot.exists()){
            const userData = docSnapshot.data();
            dispatch(loggedIn(userData))
          }

      }catch(error){
        console.log(error)
      }

    }
    fetchUser();

  },[dispatch,uid])
  //로딩되고나서 실행, 여러번 실행할려면 state값 입력해주기

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
        <Route path="/modify" element={<Modify />}></Route>
        <Route path="/findemail" element={<Findemail />}></Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App;
