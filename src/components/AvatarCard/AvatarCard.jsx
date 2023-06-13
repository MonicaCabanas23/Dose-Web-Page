import classes from "./AvatarCard.module.scss"
import { ItemButton } from './../Buttons/ItemButton/ItemButton';

export const AvatarCard = ({avatar}) => {
    const editClick = () => {
        alert(`Quieres editar ${avatar._id}`);
    }

    const deleteClick = () => {
        alert(`Quieres eliminar ${avatar._id}`)
    }

    return (
        <div className={classes["AvatarCard"]}>
            <div>
                <img src={avatar.picture} alt='avatar-image'/>
            </div>
            <div className={classes["Actions"]}>
                <ItemButton clickHandler={editClick} icon="edit"/>
                <ItemButton clickHandler={deleteClick} icon="delete"/>
            </div>
        </div>
    )
}