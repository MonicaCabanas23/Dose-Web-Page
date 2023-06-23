import classes from './Note.module.scss';
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
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
            toast.warn("Hay informacion sin rellenar", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Info Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }

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
            return res.json();
        }).then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }

            toast.success("Nota modificada!", {
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

    const handleAddNote = () => {  
        if (!info.name || !info.picture || !info.mp3) {
            toast.warn("Hay informacion sin rellenar", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Info Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
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
            return res.json();
        }).then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }

            toast.success("Acorde agregado!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Success",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            navigate("/notes");
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

    const uploadImagesToFirebase = async (images) => {
        // images is an array which has data_url and the file        
        if (info.name === undefined || (!bass && !treble)) {
            toast.warn("Ingrese el nombre de la nota o seleccione su tipo!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Name Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }

        if(images.length === 0) {
            toast.warn("Seleccione una imagen", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Audio Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
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
                }
                else {
                    setInfo(existingValues => ({
                        ...existingValues,
                        picture: `${url}`
                    }));
                }
            });
        });
    }

    const uploadAudioToFirebase = async (audio) => {
        // images is an array which has data_url and the file        
        if (info.name === undefined || info.name === "") {
            toast.warn("Ingrese el nombre del acorde!", {
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