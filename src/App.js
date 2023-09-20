import {Route, Routes, useNavigate } from "react-router-dom";
import Main from "./pages/Main";
import Member from "./pages/Member";
import Login from "./pages/Login";
import GlobalStyle from "./components/GlobalStyle";
import Aside from "./components/Aside";
import Nav from "./components/Nav";
import store, { logIn, loggedIn } from "./store";
import { ThemeProvider } from "styled-components";
import { Provider, useDispatch, useSelector } from "react-redux";
import Example from "./example/Example";
import Logout from "./pages/Logout";
import { useEffect } from "react";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import Modify from "./pages/Modify";
import Findemail from "./pages/Findemail";
import Write from "./pages/Write";
import Service from "./pages/Service";
import Notice from "./pages/service/Notice";
import Gallery from "./pages/service/Gallery";
import Qna from "./pages/service/Qna";
import Online from "./pages/service/Online";
import View from "./pages/View";
import { useState } from "react";
import Modal from "./components/Modal";


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
  // console.log(userState)

  const dispatch = useDispatch();
  const uid = sessionStorage.getItem("users");
  if(uid){
    dispatch(logIn(uid));
  }
  // console.log(uid)
  //콘솔창에 내 uid값 나온다

  useEffect(()=>{

    const fetchUser = async () =>{
      if(!uid) return;
      //만약에 uid값이 없다면 return 시킬거임

      const userDoc = doc(collection(getFirestore(),"users"),uid);
      // console.log(userDoc)

      try{
          //실패할수도있다 ,성공했을때
          const docSnapshot = await getDoc(userDoc);
          // console.log(docSnapshot)
          if(docSnapshot.exists()){
            const userData = docSnapshot.data();
            dispatch(loggedIn(userData))
          }

      }catch(error){
        // console.log(error)
      }

    }
    fetchUser();

  },[dispatch,uid])
  //로딩되고나서 실행, 여러번 실행할려면 state값 입력해주기

  const [isModal,setIsModal] = useState(true);
  const navigate = useNavigate();

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
        <Route path="/write/:board" element={<Write />}></Route>
        <Route path="/view/:board/:view" element={<View />}></Route>
        <Route path="/view/:board" element={isModal && <Modal error="유효하지 않은 경로입니다." onClose={()=>{navigate("/")}} />}></Route>
        <Route path="/service" element={<Service />}>
          <Route path="notice" element={<Notice />}></Route>
          <Route path="online" element={<Online />}></Route>
          <Route path="qna" element={<Qna />}></Route>
          <Route path="gallery" element={<Gallery />}></Route>
        </Route> 
      </Routes>
    </ThemeProvider>
  )
}

export default App;
