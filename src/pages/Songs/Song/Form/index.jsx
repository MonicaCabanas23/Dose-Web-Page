import classes from "./Form.module.scss"
import { Input } from "../../../../components/Input/Input"
import { ImageUploader } from "../../../../components/ImageUploader/ImageUploader"
import { AudioUploader } from "../../../../components/AudioUploader/AudioUploader"
import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import storage from '../../../../hooks/useFirebase';
import { useState, useEffect } from "react";

export const Form = ({ info, setInfo, id}) => {
    const [uploadedImages, setUploadedImages] = useState(0);
    const [pictures, setPictures] = useState([]);

    useEffect(() => {
        if(id && info.picture.length > 0) {

            if(pictures.length > uploadedImages) {
                uploadImagesToFirebase(pictures)
            }
            else if (pictures.length < uploadedImages) {
                let pictureArray = pictures.map((image) => {
                    return image.data_url
                })

                updateInfo(pictureArray)
            }
            else if (pictures.length == uploadedImages) {
                const imagesToUpload = pictures.filter(image => {
                    return image.data_url.substring(0,4) === "data"
                })

                uploadImagesToFirebase(imagesToUpload)
            }
        }
    }, [uploadedImages, pictures])

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

    const verifyUploading = (images) => {      
        if(images.length === 0) {
            alert("Please select an image")
            return;
        }

        // To edit
        if(id && info.picture.length > 0) {
            setUploadedImages(info.picture.length)
            setPictures(images)
            return;
        }

        // To add
        if(!id) {
            uploadImagesToFirebase(images)
        }
    }

    const updateInfo = (pictureArray) => {
        
        if (id && pictureArray.length > 0) {
            var _info = info
            _info.picture = pictureArray
            setInfo(_info)
            
            alert("modificado")
        }
        else if (pictureArray.length > 0) {
            var _info = info
            _info.picture = pictureArray
            setInfo(_info)

            alert("agregado");
        }
    }

    const uploadImagesToFirebase = async (images) => {
        let pictureArray = id ? info.picture : pictures

        // Just saves those images that are not yet uploaded
        for(var i = uploadedImages > images.length ? 0 : uploadedImages; i < images.length; i++) {
            // Gets the storage location to save the current image[i]
            var storageRef = ref(storage, `/mingo-songs-images/${images[i].file.name}`)

            // Uploads the current image in the storage reference defined before
            await uploadBytesResumable(storageRef, images[i].file)
            .then(() => {
                getDownloadURL(storageRef).then((url) => {

                    // Save url references
                    pictureArray.push(`${url}`)
                    // Update with the new uploaded images
                    if(pictureArray.length > 0) {
                        updateInfo(pictureArray)
                    }

                });
            });
        }

        
    }

    const uploadAudioToFirebase = async (audio) => {
        // audio is an array which has data_url and the file        
        if (info.name === undefined) {
            alert("no");
            return;
        }
                
        if(audio.length === 0) {
            alert("Please select an audio file")
            return;
        }        

        // Gets the storage location to save the image
        const storageRef = ref(storage, `/mingo-songs-mp3/${audio[0].name}`)
        // Uploads the audio in the storage reference defined before
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
        <>
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
                        <ImageUploader handleSaveClick={verifyUploading} number = {100}/>
                        :
                        <ImageUploader key={info.picture} item={info} handleSaveClick={verifyUploading} number = {100}/>
                    }
                </div>
                <div className={ classes["Uploader"] }>
                    <span>MP3</span>
                    <AudioUploader handleSaveClick={uploadAudioToFirebase} value={id ? info.mp3 : null}/>
                </div>
            </div>
        </>
    )
}