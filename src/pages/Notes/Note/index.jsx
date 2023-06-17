import classes from './Note.module.scss';
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from '../../../components/Input/Input';
import { ImageUploader } from '../../../components/ImageUploader/ImageUploader';
import { AudioUploader } from '../../../components/AudioUploader/AudioUploader';
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import storage from '../../../hooks/useFirebase';

import { MdOutlineArrowBackIos } from 'react-icons/md';

export const Note = () => {
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
    
    const getNote = (id) => {
        return fetch(`https://api.mingo.studio/api/musicalNote/one/${id}`, {
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
                if (Object.keys(data).length !== 0 && data.name.split(" ").slice(-1)[0] < 4) {
                    setBass(true);
                    setTreble(false);
                    return;
                } 
                setTreble(true);
                setBass(false);
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
            getNote(id);
        }
    },[]);
    
    useEffect(() => {
        setDataInfo();
    }, [data]);

    const goBack = () => {
        navigate("/notes");
    }

    const setNote = (e) => {
        setInfo(existingValues => ({
            ...existingValues,
            name: e.target.value
        }));
    }

    const handleEditNote = () => {
        if (!info.name || !info.mp3 || !info.picture) {
            alert("Alert");
            return;
        }

        console.log()

        fetch(`https://api.mingo.studio/api/musicalNote/${id}`, {
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
            alert("Nota modificada");
            return;
        }).catch((error) => {
            alert(error);
        });
    }    

    const handleAddNote = () => {  
        if (!info.name || !info.picture || !info.mp3) {
            alert("Alert");
            return;
        }
        
        fetch(`https://api.mingo.studio/api/musicalNote/`, {
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
            alert("Nota Agregada");
            navigate("/notes");
            return;
        }).catch((error) => {
            alert(error);
        });
    }

    const uploadImagesToFirebase = async (images) => {
        // images is an array which has data_url and the file        
        if (info.name === undefined || (!bass && !treble)) {
            alert("no");
            return;
        }

        if(images.length === 0) {
            alert("Please select an image")
            return;
        }

        const folder = treble ? "treble-staff" : "bass-staff";
        
        const bemol = info.name.split(" ").find(type => type === "bemol");
        const sharp = info.name.split(" ").find(type => type === "#");
        const noteFolder = bemol !== undefined ? "flats" : sharp !== undefined ? "sharps" : "natural";

        // Gets the storage location to save the image
        const storageRef = ref(storage, `/mingo-notes-images/${folder}/${noteFolder}/${images[0].file.name}`)
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
        const storageRef = ref(storage, `/mingo-notes-mp3/${audio[0].name}`)
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

    const handleChangeRadio = (e) => {
        if (e.target.id === "bass") {
            setTreble(false);
            setBass(true);
            return;
        }
    
        setTreble(true);
        setBass(false);
    }    

    return (        
        <div className={ classes["Note"] }>
            <div className={ classes['Header'] }>
                <div className={ classes['Header-Title'] }>
                    <MdOutlineArrowBackIos onClick={goBack}/>
                    <span>{id ? data.name : "Add"}</span>
                </div>
                <div className={classes["Radio-container"] } >
                    <div className={ classes["Radio"] }>
                        <input type='radio' id="treble" name="type" checked={treble} onChange={handleChangeRadio} disabled={id ? true : false}/>
                        <label htmlFor="treble">Treble</label>
                    </div>
                    <div className={ classes["Radio"] }>
                        <input type='radio' id="bass" name="type" checked={bass} onChange={handleChangeRadio} disabled={id ? true : false}/>
                        <label htmlFor="bass">Bass</label>
                    </div>
                </div>
                <div className={ classes['Header-Actions'] }>
                    <span onClick={id ? handleEditNote : handleAddNote}><u>{id ? "Edit" : "Save"}</u></span>
                </div>
            </div>

            <div className={ classes["Input-Container"] }>
                <Input id="fInput" handleInput={setNote} name="Name" value={info.name} type="text" block={id ? true : false}/>
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