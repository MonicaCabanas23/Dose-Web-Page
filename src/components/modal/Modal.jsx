import classes from './Modal.module.scss';
import { MdClose } from 'react-icons/md';

export const Modal = ({children, handleClickOpen, show}) => {
    return (
        <div className={ show ? [classes["modal"], classes["active"]].join(" ") : classes["modal"]}>
            <div className={ classes['modal-container'] } style={{"--w": "40rem", "--h": "22.5rem"}}>
                <button className={ classes['close'] } onClick={handleClickOpen}><MdClose/></button>
                <div>{children}</div>
            </div>            
        </div>
    )
}