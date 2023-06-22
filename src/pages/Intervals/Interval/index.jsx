import classes from './Interval.module.scss';
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
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
            toast.warn("Hay informacion sin rellenar", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Info Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
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
            return res.json();
        }).then((data) => {
            if (!data.error) {
                throw new Error(data.error);
            }

            toast.success("Intervalo modificado!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Success",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }).catch((error) => {
            toast.error(`${error}`, {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
        });
    }    

    const handleAddInterval = () => {
        if (!info.name || !info.mp3) {
            toast.warn("Hay informacion sin rellenar", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Info Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
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
            return res.json();
        }).then((data) => {

            if (!data.error) {
                throw new Error(data.error);
            }

            toast.success("Intervalo agregado!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Success",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            navigate("/intervals");
            return;
        }).catch((error) => {
            toast.error(`${error}`, {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
        });
    }    

    const uploadAudioToFirebase = async (audio) => {        
        if (info.name === undefined || info.name === "") {
            toast.warn("Ingrese el nombre del intervalo!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Name Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }
                
        if(audio.length === 0) {
            toast.warn("Seleccione un archivo de audio!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Audio Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
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
                }
                else {
                    setInfo(existingValues => ({
                        ...existingValues,
                        mp3: `${url}`
                    }));                    
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