import classes from './Avatar.module.scss'
import { AiOutlinePlus } from 'react-icons/ai'
import { IconContext } from "react-icons";
import { AvatarCard } from '../../components/AvatarCard/AvatarCard'
import { Modal } from '../../components/Modal/Modal';
import { ImageUploader } from '../../components/ImageUploader/ImageUploader';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject} from "firebase/storage";
import storage from '../../hooks/useFirebase';
import { useAuth, useValidateToken } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

export const Avatars = () => {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [avatars, setAvatars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState({});
    
    const getAvatars = async () => {
        setLoading(true);
        await fetch("https://api.mingo.studio/api/avatar/")
        .then((response) => response.json().then(data => {
            setAvatars(data);
            setLoading(false);
        }));
    }

    useEffect(() => {
        getAvatars()
    }, [])

    // For showing the edit modal
    const handleEditClick = (avatar) => {
        setShowEdit(!showEdit)
        setSelectedAvatar(avatar)
    }

    // For showing the delete modal
    const handleDeleteClick = (avatar) => {
        setShowDelete(!showDelete)
        setSelectedAvatar(avatar)
    }

    // For adding a new Avatar
    const handleAddClick = () => {
        setShowAdd(!showAdd)
    }

    const updateAvatar = async (imageUrl) => {
        if (!useValidateToken()) {
            toast.error("Sesion expirada!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }

        // Delete the old image from firebase
        deleteFromFirebase(selectedAvatar.picture)

        // Get token from localstorage
        const dataStorage = useAuth()
        const token = dataStorage.token

        
        // Update the avatar with the new image        
        fetch(`https://api.mingo.studio/api/avatar/${selectedAvatar._id}`, {
            method: "PUT",
            crossDomain:true,
            headers: {
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*", 
                "Authorization": `bearer ${token}`
            },
            body: JSON.stringify({
                "picture": `${imageUrl}`
            })  
        })
        .then((response) => {
            response.json().then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                toast.success("Avatar modificado!", {
                    hideProgressBar: true,
                    theme: "dark",
                    toastId: "Success Modify",
                    pauseOnFocusLoss: false,
                    autoClose:3000
                });
            });            
            setShowEdit(false);
            getAvatars();
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

    const deleteAvatar = async () => {
        if (!useValidateToken()) {
            toast.error("Sesion expirada!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }

        // Delete the old image from firebase
        deleteFromFirebase(selectedAvatar?.picture)

        // Get token from localstorage
        const dataStorage = useAuth()
        const token = dataStorage.token

        // Delete Avatar
        fetch(`https://api.mingo.studio/api/avatar/${selectedAvatar._id}`, {
            method: "DELETE",
            crossDomain:true,
            headers: {
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*", 
                "Authorization": `bearer ${token}`
            }
        })
        .then((response) => {
            response.json().then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                toast.success("Avatar eliminado!", {
                    hideProgressBar: true,
                    theme: "dark",
                    toastId: "Success Delete",
                    pauseOnFocusLoss: false,
                    autoClose:3000
                });
            });
            setShowDelete(false);
            getAvatars();
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

    // Add Avatar
    const addAvatar = (imageUrl) => {
        if (!useValidateToken()) {
            toast.error("Sesion expirada!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }

        // Get token from localstorage
        const dataStorage = useAuth()
        const token = dataStorage.token
    
        fetch("https://api.mingo.studio/api/avatar", {
            method: "POST",
            crossDomain:true,
            headers: {
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*", 
                "Authorization": `bearer ${token}`
            }, 
            body: JSON.stringify({
                "picture": `${imageUrl}`
            })
        })
        .then((response) => {
            response.json().then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }

                toast.success("Avatar agregado!", {
                    hideProgressBar: true,
                    theme: "dark",
                    toastId: "Success Add",
                    pauseOnFocusLoss: false,
                    autoClose:3000
                });
            });            
            setShowDelete(false);
            getAvatars();
        })
        .catch((error) => {
            toast.error(`${error}`, {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
        });
    }

    // Delete fron Firebase
    const deleteFromFirebase = (urlRef) => {
        // Get the storage reference
        const storageRef = ref(storage, urlRef)

        // Delete the image
        deleteObject(storageRef).then(() => {            
        }).catch((error) => {
            toast.error(`${error}`, {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
        })
    }

    // Save in Firebase
    const uploadToFirebase = async (images) => {
        // images is an array which has data_url and the file
        if(!images || images.length <= 0) {
            toast.warn("Seleccione una imagen", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Image Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }

        // Gets the storage location to save the image
        const storageRef = ref(storage, `/mingo-avatar-images/${images[0].file.name}`)
        // Uploads the image in the storage reference defined before
        uploadBytesResumable(storageRef, images[0].file)
        .then(() => {
            getDownloadURL(storageRef).then((url) => {
                if (showEdit) {
                    updateAvatar(url)
                    setShowEdit(false)
                }
                else {
                    addAvatar(url)
                    setShowAdd(false)
                }
            });
        });
    }

    return (
        <div className={classes["Container"]}>
            {
                loading ? 
                <div className={ classes["Loader-container"] }>
                    <TailSpin
                        height="80"
                        width="80"
                        color="#FFC107"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
                :
                <>
                    {
                        avatars && 
                        avatars.map((avatar) => (
                            <AvatarCard  key={avatar._id} avatar={avatar} handleEdit={handleEditClick} handleDelete={handleDeleteClick}/>
                        ))
                    }
                    <IconContext.Provider value={{ color: "white", size: "40px" }}>
                        <button className={classes["AddButton"]} onClick={handleAddClick}>
                            <AiOutlinePlus />
                        </button>
                    </IconContext.Provider>
                    {
                        showEdit && selectedAvatar.picture ?
                        <Modal handleClickOpen={handleEditClick} show={showEdit}>
                            <span className={ [classes["Span"], classes["Title"]].join(" ") }>Edit</span>
                            <ImageUploader item={selectedAvatar} handleSaveClick={uploadToFirebase} number = {1}/>
                        </Modal> :
                        <></>
                    }
                    {
                        showDelete ?
                        <Modal handleClickOpen={handleDeleteClick} show={showDelete} w="27.5rem" h="15rem">
                            <span className={ [classes["Span"], classes["Title"]].join(" ") }>Delete</span>
                            <div className={ classes["ButtonContainer"] }>
                                <button className={ classes['SaveButton'] } onClick={deleteAvatar}>Delete</button>
                            </div>
                        </Modal> :
                        <></>
                    }
                    {
                        showAdd ? 
                        <Modal handleClickOpen={handleAddClick} show={showAdd}>
                            <span className={ [classes["Span"], classes["Title"]].join(" ") }>Add</span>
                            <ImageUploader handleSaveClick={uploadToFirebase} number = {1}/>
                        </Modal> :
                        <></>
                    }
                </>
            }            
        </div>
    )
}