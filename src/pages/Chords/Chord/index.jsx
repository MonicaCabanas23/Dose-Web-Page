import classes from './Chord.module.scss';
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from '../../../components/Input/Input';
import { ImageUploader } from '../../../components/ImageUploader/ImageUploader';
import { AudioUploader } from '../../../components/AudioUploader/AudioUploader';
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import storage from '../../../hooks/useFirebase';

import { MdOutlineArrowBackIos } from 'react-icons/md';

export const Chord = () => {
    const {id} = useParams();
    const [treble, setTreble] = useState(false);
    const [bass, setBass] = useState(false);    
    const [data, setData] = useState({});
    const [info, setInfo] = useState({
        name: "",
        picture: "",
        mp3: ""
    });
    const navigate = useNavigate();
    
    const getChord = (id) => {
        return fetch(`https://api.mingo.studio/api/chord/one/${id}`, {
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
            picture: data.picture,
            mp3: data.mp3
        });
    }

    useEffect(() => {
        if (id !== undefined) {
            getChord(id);
        }
    },[]);
    
    useEffect(() => {
        setDataInfo();
    }, [data]);

    const goBack = () => {
        navigate("/chords");
    }

    const setChord = (e) => {
        setInfo(existingValues => ({
            ...existingValues,
            name: e.target.value
        }));
    }

    const handleEditChord = () => {
        if (!info.name || !info.mp3 || !info.picture) {
            alert("Alert");
            return;
        }

        fetch(`https://api.mingo.studio/api/chord/${id}`, {
            method:"PUT",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `bearer ${useAuth().token}`
            },
            body: JSON.stringify({
                picture: info.picture,
                mp3: info.mp3
            }),
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Something went wrong');
            }
            return res.json();
        }).then((data) => {
            alert("Acorde modificado");
            return;
        }).catch((error) => {
            alert(error);
        });
    }    

    const handleAddChord = () => {  
        if (!info.name || !info.picture || !info.mp3) {
            alert("Alert");
            return;
        }
        
        fetch(`https://api.mingo.studio/api/chord/`, {
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
                picture: info.picture,
                mp3: info.mp3,
            }),
        })
        .then((res) => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text) })
            }
            return res.json();
        }).then((data) => {
            alert("Acorde Agregado");
            navigate("/chords");
            return;
        }).catch((error) => {
            alert(error);
        });
    }

    const uploadImagesToFirebase = async (images) => {
        // images is an array which has data_url and the file       
        if(images.length === 0) {
            alert("Please select an image")
            return;
        }

        // Gets the storage location to save the image
        const storageRef = ref(storage, `/mingo-chords-images/${images[0].file.name}`)
        // Uploads the image in the storage reference defined before
        await uploadBytesResumable(storageRef, images[0].file)
        .then(() => {
            getDownloadURL(storageRef).then((url) => {

                if (id) {
                    setInfo(existingValues => ({
                        ...existingValues,
                        picture: `${url}`
                    }));

                    alert("modificado");
                }
                else {
                    setInfo(existingValues => ({
                        ...existingValues,
                        picture: `${url}`
                    }));

                    alert("agregado");
                }
            });
        });
    }

    const uploadAudioToFirebase = async (audio) => {
        // images is an array which has data_url and the file        
        if (info.name === undefined) {
            alert("no");
            return;
        }
                
        if(audio.length === 0) {
            alert("Please select an audio file")
            return;
        }        

        // Gets the storage location to save the image
        const storageRef = ref(storage, `/mingo-chords-mp3/${audio[0].name}`)
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
        <div className={ classes["Chord"] }>
            <div className={ classes['Header'] }>
                <div className={ classes['Header-Title'] }>
                    <MdOutlineArrowBackIos onClick={goBack}/>
                    <span>{id ? data.name : "Add"}</span>
                </div>
                <div className={ classes['Header-Actions'] }>
                    <span onClick={id ? handleEditChord : handleAddChord}><u>{id ? "Edit" : "Save"}</u></span>
                </div>
            </div>

            <div className={ classes["Input-Container"] }>
                <Input id="fInput" handleInput={setChord} name="Name" value={info.name} type="text" block={id ? true : false}/>
            </div>

            <div className={ classes["Uploaders"] }>
                <div className={ classes["Uploader"] }>
                    <span>Picture</span>
                    {
                        !id ?
                        <ImageUploader handleSaveClick={uploadImagesToFirebase} number = {1}/>
                        :
                        <ImageUploader key={info.picture} item={info} handleSaveClick={uploadImagesToFirebase} number = {1}/>
                    }
                </div>
                <div className={ classes["Uploader"] }>
                    <span>MP3</span>
                    <AudioUploader handleSaveClick={uploadAudioToFirebase} value={id ? info.mp3 : null}/>
                </div>
            </div>
        </div>        
    )
}