import classes from './ItemButton.module.scss';
import { AiFillEdit } from 'react-icons/ai';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { IconContext } from "react-icons";

export const ItemButton = ({clickHandler, icon}) => {

    return (
        /* Send an "edit" string to the icon parameter and recieve an edit button
        otherwise, get a delete button */
        icon == "edit" ?
        <IconContext.Provider value={{ color: "white", size: "24px" }}>
            <button className={classes["EditButton"]} onClick={clickHandler}>
                <AiFillEdit />
            </button>
        </IconContext.Provider> : 
        <IconContext.Provider value={{ color: "white", size: "24px" }}>
            <button className={classes["DeleteButton"]} onClick={clickHandler}>
                <BsFillTrash3Fill />
            </button>
        </IconContext.Provider>
    )
}