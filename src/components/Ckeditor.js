import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from 'styled-components';
import { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { faList, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from './Modal';
import { useEffect } from 'react';
import { getStorage,ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'

const ButtonWrap = styled.div`
    display: flex;
    justify-content: space-between;
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

function Ckeditor({title,postData}) {

    const memberProfile = useSelector(state => state.user);
    const [isModal,setIsModal] = useState(false);
    const navigate = useNavigate();
    const [writeData,setWriteData] = useState("");
    // console.log(memberProfile)
    const [message,setMessage] = useState("");
    const {board,view} = useParams();
    // alert(board) notice에 들어왔다면 notice로 알림창 뜬다
    const [editorInstance,setEditorInstance] = useState(null);
    const [fileUrl,setFileUrl] = useState("");

    useEffect(()=>{
        if(postData){
            setWriteData(postData.content);
        }
    },[postData])

    const dataSubmit = async ()=>{
        if(title.length === 0){
            // alert("제목을 입력해주세요.")
            setIsModal(!isModal);
            setMessage("제목을 입력해주세요.")
            return;
        }else if(writeData.length === 0){
            setIsModal(!isModal);
            setMessage("내용을 입력해주세요.")
            return;
        }

        try{
            if(board && view){
                //수정되는부분
                const postRef = doc(getFirestore(),board,view);
                await updateDoc(postRef,{
                    title : title,
                    content : writeData
                })
                alert("게시글이 성공적으로 수정 되었습니다.")
                
            }else{
                const fileInput = document.querySelector('#file').files[0]
                console.log(fileInput)
                if(fileInput){
                    uploadToFirebase(fileInput)
                }
                // await addDoc(collection(getFirestore(),board),{
                //     //set 은 이름을 지정할수있다
                //     //add 는 자동으로 랜덤값이 올라간다.
                //     title : title,
                //     content : writeData,
                //     view : 1,
                //     uid : memberProfile.uid,
                //     name : memberProfile.data.name,
                //     email : memberProfile.data.email,
                //     nickname : memberProfile.data.nickname,
                //      file : fileUrl,
                //     timestamp : serverTimestamp()
                // })
                // alert("게시글이 성공적으로 등록 되었습니다.")
            }
            // navigate(`/service/${board}`)

        }catch(error){
            setIsModal(!isModal);
            setMessage(error)
        }
    }

    const uploadToFirebase = async (file) =>{
        const storageRef = ref(getStorage(),'images/' + file.name);
        const upload = uploadBytesResumable(storageRef,file);

        return new Promise((resolve,reject)=>{
            upload.on('state_changed',
            (snapshot) =>{

            },

            (error)=>{
                reject(error)
            },
            ()=>{
                getDownloadURL(upload.snapshot.ref).then((result)=>{
                    resolve(result)
                    console.log(result)
                    setFileUrl(result)
                })
            })
        })
    }

    function UploadAdapter(editor){
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>{
            return{
                upload:async () =>{
                    const file = await loader.file;
                    const downURL = await uploadToFirebase(file);
                    return {default : downURL} 
                }
            }
        }
    } 

    return (
        <>
            {/* {title} */}
            {/* {writeData} */}
            {isModal && <Modal error={message} onClose={()=>{setIsModal(false)}} /> }
            <CKEditor
                editor={ClassicEditor}
                data={writeData}
                config={{
                        placeholder: "내용을 입력하세요.",
                        extraPlugins : [UploadAdapter]
                    }}
                onReady={ editor => {
                    setEditorInstance(editor)
                    // You can store the "editor" and use when it is needed.
                    // console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setWriteData(data);
                    // console.log( { event, editor, data } );
                } }
                onBlur={ ( event, editor ) => {
                    // console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    // console.log( 'Focus.', editor );
                } }
            />
            <input type="file" id="file" />
            <ButtonWrap>
                <Button><Link to='/service/notice'><FontAwesomeIcon icon={faList} />목록</Link></Button>
                <Button onClick={dataSubmit}><FontAwesomeIcon icon={faPen} />완료</Button>
            </ButtonWrap>
        </>
     )
}

export default Ckeditor