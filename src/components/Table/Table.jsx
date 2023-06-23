import classes from './Table.module.scss';
import { useState } from 'react';
import { BiEditAlt, BiTrash, BiAddToQueue } from 'react-icons/bi';
import { AiOutlineReload } from 'react-icons/ai';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';

export const Table = ({info = [], reloadClick, addClick, editClick, deleteClick, generateActions=true, allowAddEdit=true}) => {
    const [current, setCurrent] = useState(0);
    const [last, setLast] = useState(10)
    const [offset, setOffset] = useState(10);

    const tableInfo = info.slice(current, last).map(info => {
        return (
            <div className={ classes['Table-Row'] } key={info._id}>
                <div className={ classes['Table-Column'] } style={{ "--gap": "1rem"}}>                    
                    <span>{info.name}</span>
                </div>
                {generateActions &&
                    <div className={ [ classes['Table-Column'], classes['Icons']].join(" ") } style={{ "--gap": "3rem" }}>
                        {allowAddEdit &&
                            <BiEditAlt onClick={e => editClick(info._id)}/>
                        }
                        <BiTrash onClick={() => {deleteClick(info)}}/>
                    </div>
                }
                
            </div>
        )
    })

    const upPage = () => {
        if (last > info.length) {
            return;
        }
        setCurrent(current+10);
        setLast(last+offset);
    }

    const downPage = () => {
        if (current === 0) {
            return;
        }
        setCurrent(current-10);
        setLast(last-offset);
    }

    return (
        <div className={ classes['Table'] }>
            <div className={ classes['Table-Header'] }>
                <div className={ classes['Table-Header-Actions'] } style={{ "--gap": "2rem" }}>                    
                    <AiOutlineReload onClick={reloadClick}/>
                    { allowAddEdit &&
                        <BiAddToQueue onClick={addClick}/>
                    }
                </div>
                <div className={ classes['Table-Header-Pagination'] } style={{ "---gap": "2rem" }}>
                    {current + 1} - {last > info.length ? info.length : last} de {info.length}
                    <MdOutlineArrowBackIos onClick={downPage}/>
                    <MdOutlineArrowForwardIos onClick={upPage}/>
                </div>
            </div>
            {tableInfo}            
        </div>
    )
}