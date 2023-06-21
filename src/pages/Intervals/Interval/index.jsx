import classes from './Interval.module.scss';
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from '../../../components/Input/Input';
import { AudioUploader } from '../../../components/AudioUploader/AudioUploader';
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import storage from '../../../hooks/useFirebase';

import { MdOutlineArrowBackIos } from 'react-icons/md';

export const Interval = () => {
    const {id} = useParams();
    const [data, setData] = useState({});
    const [info, setInfo] = useState({
        name: "",        
        mp3: ""
    });
    const navigate = useNavigate();
    
    const getInterval = (id) => {
        return fetch(`https://api.mingo.studio/api/interval/one/${id}`, {
            method: "GET",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${useAuth().token}`
            }            
        })
        .then(
            response => response.json().then(data => {
                setData(data);                
            })
        ).catch(() => {
        })
    }

    const setDataInfo = () => {
        setInfo({
            name: data.name,            
            mp3: data.mp3
        });
    }

    useEffect(() => {
        if (id !== undefined) {
            getInterval(id);
        }
    },[]);
    
    useEffect(() => {
        setDataInfo();
    }, [data]);

    const goBack = () => {
        navigate("/intervals");
    }

    const setInterval = (e) => {
        setInfo(existingValues => ({
            ...existingValues,
            name: e.target.value
        }));
    }

    const handleEditInterval = () => {
        if (!info.name || !info.mp3) {
            alert("Alert");
            return;
        }

        fetch(`https://api.mingo.studio/api/interval/${id}`, {
            method:"PUT",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `bearer ${useAuth().token}`
            },
            body: JSON.stringify({                
                mp3: info.mp3
            }),
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Something went wrong');
            }
            return res.json();
        }).then((data) => {
            alert("Intervalo modificada");
            return;
        }).catch((error) => {
            alert(error);
        });
    }    

    const handleAddInterval = () => {  
        if (!info.name || !info.mp3) {
            alert("Alert");
            return;
        }
        
        fetch(`https://api.mingo.studio/api/interval/`, {
            method:"POST",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `bearer ${useAuth().token}`
            },
            body: JSON.stringify({
                name: info.name,                
                mp3: info.mp3,
            }),
        })
        .then((res) => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text) })
            }
            return res.json();
        }).then((data) => {
            alert("Intervalo Agregada");
            navigate("/intervals");
            return;
        }).catch((error) => {
            alert(error);
        });
    }    

    const uploadAudioToFirebase = async (audio) => {
        // images is an array which has data_url and the file        
        if (info.name === undefined) {
            alert("Please fill the name first");
            return;
        }
                
        if(audio.length === 0) {
            alert("Please select an audio file")
            return;
        }        

        // Gets the storage location to save the image
        const storageRef = ref(storage, `/mingo-intervals-mp3/${audio[0].name}`)
        // Uploads the image in the storage reference defined before
        await uploadBytesResumable(storageRef, audio[0])
        .then(() => {
            getDownloadURL(storageRef).then((url) => {

                if (id) {                    
                    setInfo(existingValues => ({
                        ...existingValues,
                        mp3: `${url}`
                    }));

                    alert("modificado");
                }
                else {
                    setInfo(existingValues => ({
                        ...existingValues,
                        mp3: `${url}`
                    }));

                    alert("agregado");
                }
            });
        });
    }


    return (        
        <div className={ classes["Interval"] }>
            <div className={ classes['Header'] }>
                <div className={ classes['Header-Title'] }>
                    <MdOutlineArrowBackIos onClick={goBack}/>
                    <span>{id ? data.name : "Add"}</span>
                </div>                
                <div className={ classes['Header-Actions'] }>
                    <span onClick={id ? handleEditInterval : handleAddInterval}><u>{id ? "Edit" : "Save"}</u></span>
                </div>
            </div>

            <div className={ classes["Input-Container"] }>
                <Input id="fInput" handleInput={setInterval} name="Name" value={info.name} type="text" block={id ? true : false}/>
            </div>

            <div className={ classes["Uploaders"] }>
                <div className={ classes["Uploader"] }>
                    <span>MP3</span>
                    <AudioUploader handleSaveClick={uploadAudioToFirebase} value={id ? info.mp3 : null}/>
                </div>
            </div>
        </div>        
    )
}