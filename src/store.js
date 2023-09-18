import { configureStore, createSlice } from "@reduxjs/toolkit";

let user = createSlice({
    name : "user",
    // "user" 는 스테이트 이름 ,똑같이 써주기 let user
    // initialState : "이은주",
    initialState : {
        loggedIn : false,
        data : null,
        uid : null
    },
    reducers : {
        logIn : (state,action) =>{
            state.loggedIn = true;
            state.uid = action.payload;
        },
        loggedIn : (state,action)=>{
            state.loggedIn = true;
            state.data = action.payload;
        },
        logOut : (state,action) =>{
            state.loggedIn = false;
            state.data = null;
            state.uid = null;
            //데이터 다 비우기 위해서
        }

        // changeName(state) {
        //     // return "바뀜" + state
        //     return "바뀜"
        // }
    }
})

let dark = createSlice({
    name : "dark",
    initialState : "light" ,
    reducers : {
        toggleTheme : (state) => state === "light" ? "dark" : "light"
    }
})

export const {logIn,logOut,loggedIn} = user.actions;
//이렇게 써야지 다른곳에서도 쓸수있음 (name(user).actions)
export const {toggleTheme} = dark.actions;

let id = createSlice({
    name : "id",
    initialState : "dldmswn0719"
})

export default configureStore({
    reducer : {
        user : user.reducer,
        id : id.reducer,
        dark : dark.reducer
    }
})