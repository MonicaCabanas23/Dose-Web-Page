import classes from './Song.module.scss';
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from '../../../components/Input/Input';
import { ImageUploader } from '../../../components/ImageUploader/ImageUploader';
import { AudioUploader } from '../../../components/AudioUploader/AudioUploader';
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import storage from '../../../hooks/useFirebase';

import { MdOutlineArrowBackIos } from 'react-icons/md';

export const Song = () => {
    const {id} = useParams();    
    const [data, setData] = useState({});
    const [info, setInfo] = useState({
        name: "",
        picture: [], 
        mp3: "",
        author: "",
        ppm: "", 
    });
    const navigate = useNavigate();
    
    const getSong = (id) => {
        return fetch(`https://api.mingo.studio/api/song/one/${id}`, {
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

    useEffect(() => {
        if (id !== undefined) {
            getSong(id);
        }
        console.log(data)
    },[]);

    useEffect(() => {
        setInfo(data)
    }, [data])

    const goBack = () => {
        navigate("/songs");
    }

    const setSongName = (e) => {

        setInfo(existingValues => ({
            ...existingValues,
            name: e.target.value
        }));
    }

    const setSongAuthor = (e) => {
        setInfo(existingValues => ({
            ...existingValues,
            author: e.target.value
        }));
    }

    const setSongPPM = (e) => {
        setInfo(existingValues => ({
            ...existingValues,
            ppm: e.target.value
        }));
    }

    const handleNextClick = () => {
        if (!info.name || !info.mp3 || !info.picture) {
            alert("Alert");
            return;
        }
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
        <div className={ classes["Song"] }>
            <div className={ classes['Header'] }>
                <div className={ classes['Header-Title'] }>
                    <MdOutlineArrowBackIos onClick={goBack}/>
                    <span>{id ? data.name : "Add"}</span>
                </div>
                <div className={ classes['Header-Actions'] }>
                    <span onClick={ handleNextClick }><u>{"Next"}</u></span>
                </div>
            </div>

            <div className={classes["Inputs"]}>
                <div className={ classes["Input-Container"] }>
                    <Input id="fInput" handleInput={setSongName} name="Name" value={info.name} type="text" block={id ? true : false}/>
                </div>
                <div className={ classes["Input-Container"] }>
                    <Input id="fInput" handleInput={setSongAuthor} name="Author" value={info.author} type="text" block={id ? true : false}/>
                </div>
                <div className={ classes["Input-Container"] }>
                    <Input id="fInput" handleInput={setSongPPM} name="PPM" value={info.ppm} type="text" block={id ? true : false}/>
                </div>
            </div>


            <div className={ classes["Uploaders"] }>
                <div className={ classes["Uploader"] }>
                    <span>Picture</span>
                    {
                        !id ?
                        <ImageUploader handleSaveClick={uploadImagesToFirebase} number = {100}/>
                        :
                        <ImageUploader key={info.picture} item={info} handleSaveClick={uploadImagesToFirebase} number = {100}/>
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