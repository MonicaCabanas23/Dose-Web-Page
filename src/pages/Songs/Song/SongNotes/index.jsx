import classes from "./SongNotes.module.scss";
import { Cards } from "../../../../components/Card/Cards/Cards";
import { MdAdd } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { useState, useEffect } from "react";

export const SongNotes = ({ info, setInfo, id}) => {
    const [data, setData] = useState([])
    let i = 0

    useEffect(() => {
        if(info.notes) {
            setData(info.notes.notes)
        }
    }, [])
    

    const handleClickEdit = () => {

    }

    const handleClickDelete = () => {

    }

    const handleClickAdd = () => {

    }

    return (
        <div className={classes["cards-container"]}>
            {console.log(info.notes)}
            {data ? 
                data.map(
                    note => {
                        return (
                            <Cards key={`${note.symbol}` + `${i++}`}>
                                <div>
                                    <span className={ classes["Span"] }>{note.symbol}</span>{/* <span className={ [classes["Span"], classes["Role-name"]].join(" ") }>{roles.type}</span> */}
                                </div>
                                <div className={ classes['Actions'] }>
                                    <button onClick={handleClickEdit} id="edit" ><BiEditAlt/></button>
                                    <button onClick={handleClickDelete} id="delete"><BiTrash/></button>
                                </div>
                            </Cards>
                        );
                    }
                ) : <></>
            }


            <Cards add="true" onClick={handleClickAdd}>
                <MdAdd/>
            </Cards>
        </div>
    )
}