import classes from './NotFound.module.scss';

import { Link } from 'react-router-dom';
import { FaRegSadCry } from 'react-icons/fa'

export const NotFound = () => {
    return (
        <div className={ classes["NotFound404"] }>
            <div className={ classes["SadIcon"]}>
                <FaRegSadCry/>
            </div>
            <div className={ classes["Info404"] }>
                <h2>404</h2>
                <h3>Página no encontrada</h3>
            </div>

            <Link to="/">Regresar a inicio</Link>
        </div>
    )
}