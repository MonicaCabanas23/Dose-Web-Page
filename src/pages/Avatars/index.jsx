import classes from './Avatar.module.scss'
import { AiOutlinePlus } from 'react-icons/ai'
import { IconContext } from "react-icons";
import { AvatarCard } from '../../components/AvatarCard/AvatarCard'
import { Modal } from '../../components/modal/Modal';
import { ImageUploader } from '../../components/ImageUploader/ImageUploader';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, getMetadata } from "firebase/storage";
import storage from '../../hooks/useFirebase';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react'

export const Avatars = () => {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState({});
    
    const getAvatars = async () => {
        const response = await fetch("https://api.mingo.studio/api/avatar/")
        .then((response) => response.json());

        setAvatars(response);
    }

    useEffect(() => {
        getAvatars()
    }, [])

    // For showing the edit modal
    const handleEditClick = (identifier) => {
        setShowEdit(!showEdit)
        setSelectedAvatar(identifier)
    }

    // For showing the delete modal
    const handleDeleteClick = () => {
        setShowDelete(!showDelete)
    }

    // For adding a new Avatar
    const handleAddClick = () => {
        alert("Agregar")
    }

    const updateAvatar = async (imageUrl) => {
        // Delete the old image from firebase

        // Get token from localstorage
        const dataStorage = useAuth()
        const token = dataStorage.token
        
        // Update the avatar with the new image
        try {
            const response = await fetch(`https://api.mingo.studio/api/avatar/${selectedAvatar._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json",
                    "Accept": "*/*",
                    "Acces-Control-Allow-Origin": "*", 
                    "Authorization": "Bearer " + token
                },
                body: {
                    "picture": imageUrl
                }  
            })
            .then((response) => response.json());

            getAvatars()
        } catch(error) {
            console.log(error)
        }
    }

    // Save in Firebase
    const uploadToFirebase = (images) => {
        // images is an array which has data_url and the file
        if(!images) {
            alert("Please select an image")
        }

        // Gets the storage location to save the image
        const storageRef = ref(storage, `/mingo-avatar-images/${images[0].file.name}`)
        // Uploads the image in the storage reference defined before
        const uploadTask = uploadBytesResumable(storageRef, images[0].file);

        uploadTask.on(
            "state_changed",
            () => {
                // Gets the url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    updateAvatar(url)
                });
            }
        ); 
    }

    return (
        <div className={classes["Container"]}>
            {
                avatars && 
                avatars.map((avatar) => (
                    <AvatarCard avatar={avatar} handleEdit={handleEditClick} handleDelete={handleDeleteClick}/>
                ))
            }
             <IconContext.Provider value={{ color: "white", size: "40px" }}>
                <button className={classes["AddButton"]} onClick={handleAddClick}>
                    <AiOutlinePlus />
                </button>
             </IconContext.Provider>

             <Modal handleClickOpen={handleEditClick} show={showEdit}>
                <span className={ [classes["Span"], classes["Title"]].join(" ") }>Edit</span>
                <ImageUploader handleSaveClick={uploadToFirebase} number = {1}/>
            </Modal>

            <Modal handleClickOpen={handleDeleteClick} show={showDelete}>
                <span className={ [classes["Span"], classes["Title"]].join(" ") }>Delete</span>
            </Modal>
        </div>
    )
}