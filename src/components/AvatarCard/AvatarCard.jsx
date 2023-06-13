import classes from "./AvatarCard.module.scss"
import { ItemButton } from './../Buttons/ItemButton/ItemButton';

export const AvatarCard = ({avatar, handleEdit, handleDelete}) => {

    return (
        <div className={classes["AvatarCard"]}>
            <div>
                <img src={avatar.picture} alt='avatar-image'/>
            </div>
            <div className={classes["Actions"]}>
                <ItemButton clickHandler={handleEdit} icon="edit"/>
                <ItemButton clickHandler={handleDelete} icon="delete"/>
            </div>
        </div>
    )
}