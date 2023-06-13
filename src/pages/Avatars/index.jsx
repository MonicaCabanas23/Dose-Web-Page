import classes from './Avatar.module.scss'
import { AvatarCard } from '../../components/AvatarCard/AvatarCard'
import { useEffect, useState } from 'react'

export const Avatars = () => {
    const [avatars, setAvatars] = useState([]);

    const getAvatars = async () => {
        const response = await fetch("https://api.mingo.studio/api/avatar/")
        .then((response) => response.json());

        setAvatars(response);
    }

    useEffect(() => {
        getAvatars()
    }, [])

    return (
        <div className={classes["Container"]}>
            {
                avatars && 
                avatars.map((avatar) => (
                    <AvatarCard avatar={avatar}/>
                ))
            }
        </div>
    )
}