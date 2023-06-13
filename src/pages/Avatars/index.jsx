import classes from './Avatar.module.scss'
import { AiOutlinePlus } from 'react-icons/ai'
import { IconContext } from "react-icons";
import { AvatarCard } from '../../components/AvatarCard/AvatarCard'
import { useEffect, useState } from 'react'

export const Avatars = () => {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [avatars, setAvatars] = useState([]);
    
    const getAvatars = async () => {
        const response = await fetch("https://api.mingo.studio/api/avatar/")
        .then((response) => response.json());

        setAvatars(response);
    }

    useEffect(() => {
        getAvatars()
    }, [])

    // For showing the edit modal
    const handleEditClick = () => {
        setShowEdit(!showEdit)
        alert("Quieres editar")
    }

    // For showing the delete modal
    const handleDeleteClick = () => {
        setShowDelete(!showDelete)
        alert("Quieres eliminar")
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
                <button className={classes["AddButton"]}>
                    <AiOutlinePlus />
                </button>
             </IconContext.Provider>
        </div>
    )
}