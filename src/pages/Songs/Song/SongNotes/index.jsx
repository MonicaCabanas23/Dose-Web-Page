import classes from "./SongNotes.module.scss";
import { Cards } from "../../../../components/Card/Cards/Cards";
import { MdAdd } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { Select, MenuItem } from "@mui/material";
import { Modal } from "../../../../components/Modal/Modal";
import { useState, useEffect } from "react";

export const SongNotes = ({ info, setInfo, id}) => {
    let i = 0
    const [data, setData] = useState([])
    const [showEdit, setShowEdit] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [note, setNote] = useState(true)
    const [silence, setSilence] = useState(false)
    const [flat, setFlat] = useState(true)
    const [sharp, setSharp] = useState(true)
    // For saving the symbol
    const [selectedNote, setSelectedNote] = useState("Do 4")
    const [selectedNotation, setSelectedNotation] = useState("")
    const [selectedDuration, setSelectedDuration] = useState(4)
    const [durationValue, setDurationValue] = useState({
        $numberDecimal: 1
    })
    // For comboBoxes
    const availableNotes = [
        "Do 4", 
        "Re 4", 
        "Mi 4", 
        "Fa 4", 
        "Sol 4",
        "La 4", 
        "Si 4", 
        "Do 5", 
        "Re 5", 
        "Mi 5", 
        "Fa 5", 
        "Sol 5", 
        "La 5"
    ];
    const noteNotation = [ 
        {
            "name": "Natural",
            "value": "natural", 
            "disabled": false
        }, {
            "name": "Sostenido", 
            "value": "#",
            "disabled": !sharp ? true : false
        }, {
            "name": "Bemol", 
            "value": "bemol", 
            "disabled": !flat ? true : false
        } 
    ];
    const durationType = [
        {
            "name": "Redonda",
            "value": 4
        }, {
            "name": "Blanca", 
            "value": 2
        },{
            "name": "Negra", 
            "value": 1
        }, {
            "name": "Corchea",
            "value": 0.5
        }, {
            "name": "Semicorchea", 
            "value": 0.25
        }, {
            "name": "Fusa", 
            "value": 0.125
        }
    ];

    useEffect(() => {
        if(info.notes) {
            setData(info.notes.notes)
        }
    }, [])

    useEffect(() => {
        if(selectedNotation === "bemol" || selectedNotation === "#") {
            const noteName = selectedNote.match(/^\w+/g)
            const numberNote = selectedNote.match(/\w+$/g)
            const newName = noteName + " " + selectedNotation + " " + numberNote
            setSelectedNote(newName)
            return;
        }
    }, [selectedNotation])

    useEffect(() => {
        // Duration of a note depending of the time of note it is (black, white, corchea, etc)
        const unitTime = 60 / info.ppm
        const duration = {
            $numberDecimal: (selectedDuration * unitTime).toFixed(3)
        }

        setDurationValue(duration)

    }, [selectedDuration])

    useEffect(() => {
        const notesObject = {
            "notes": data
        }

        setInfo(existingValues => ({
            ...existingValues,
            notes: notesObject
        }));

    }, [data])

    const handleChangeRadio = (e) => {
        if(e.target.id === "note") {
            setNote(true)
            setSilence(false)
            return; 
        }
        
        setNote(false)
        setSilence(true)
        setSelectedNote("Silence")
    }

    const handleNoteChange = (e) => {
        if(e.target.value === "Mi 4" || e.target.value === "Mi 5" || e.target.value === "Si 4") {
            setSharp(false)
            setFlat(true)

            // Update the note
            setSelectedNote(e.target.value)

            return;
        }
        else if(e.target.value === "Fa 4" || e.target.value === "Fa 5") {
            setFlat(false)
            setSharp(true)

            // Update the note
            setSelectedNote(e.target.value)

            return;
        }
        setSharp(true)
        setFlat(true)

        // Update the note
        setSelectedNote(e.target.value)
    }

    const handleNotationChange = (e) => {
        if (e.target.value === "natural") {
            setSelectedNotation("")
            return;
        }
        setSelectedNotation(e.target.value)
    }

    const handleDurationChange = (e) => {
        setSelectedDuration(e.target.value)
    }

    const handleClickEdit = () => {
        setShowEdit(!showEdit)
    }

    const handleClickDelete = () => {
        setShowDelete(!showDelete)
    }

    const handleClickAdd = () => {
        setShowAdd(!showAdd)
    }

    const deleteNote = () => {
        alert("Tratando de eliminar")
    }

    const addNote = () => {
        const noteObject = {
            "symbol": selectedNote,
            "duration": durationValue
        }
        
        let _data = data
        _data.push(noteObject)
        setData(_data)
        setShowAdd(false)
        console.log(info)
    }

    return (
        <div className={classes["cards-container"]}>
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

            {
                showEdit ?
                <Modal handleClickOpen={handleClickEdit} show={showEdit}>
                    <span className={ [classes["Span"], classes["Title"]].join(" ") }>Edit</span>
                    <div className={classes["Radio-container"] } >
                        <div className={ classes["Radio"] }>
                            <input type='radio' id="note" name="notes" checked={note} onChange={handleChangeRadio}/>
                            <label htmlFor="note">Note</label>
                        </div>
                        <div className={ classes["Radio"] }>
                            <input type='radio' id="silence" name="notes" checked={silence} onChange={handleChangeRadio} />
                            <label htmlFor="silence">Silence</label>
                        </div>
                    </div>
                    <div className={classes["notes-options"]}>
                        <Select className={classes["select"]} defaultValue={"Do 4"} onChange={handleNoteChange} disabled={silence ? true : false}>
                            {
                                availableNotes.map((note) => {
                                    return <MenuItem key={note} value={note} > {note} </MenuItem>
                                })
                            }
                        </Select>
                        <Select className={classes["select"]} defaultValue={"natural"} onChange={handleNotationChange} disabled={silence ? true : false}>
                            {
                                noteNotation.map((notation) => {
                                    return <MenuItem key={notation.name} value={notation.value} disabled={notation.disabled}> {notation.name} </MenuItem>
                                })
                            }
                        </Select>
                        <Select className={classes["select"]} defaultValue={"4"} onChange={handleDurationChange}>
                            {
                                durationType.map((duration) => {
                                    return <MenuItem key={duration.name} value={duration.value} > {duration.name} </MenuItem>
                                })
                            }
                        </Select>
                    </div>
                    <div className={ classes["ButtonContainer"] }>
                        <button className={ classes['SaveButton'] } onClick={addNote}>Save</button>
                    </div>
                </Modal> :
                <></>
            }
            {
                showDelete ?
                <Modal handleClickOpen={handleClickDelete} show={showDelete} w="27.5rem" h="15rem">
                    <span className={ [classes["Span"], classes["Title"]].join(" ") }>Delete</span>
                    <div className={ classes["ButtonContainer"] }>
                        <button className={ classes['SaveButton'] } onClick={deleteNote}>Delete</button>
                    </div>
                </Modal> :
                <></>
            }
            {
                showAdd ? 
                <Modal handleClickOpen={handleClickAdd} show={showAdd}>
                    <span className={ [classes["Span"], classes["Title"]].join(" ") }>Add</span>
                    <div className={classes["Radio-container"] } >
                        <div className={ classes["Radio"] }>
                            <input type='radio' id="note" name="notes" checked={note} onChange={handleChangeRadio}/>
                            <label htmlFor="note">Note</label>
                        </div>
                        <div className={ classes["Radio"] }>
                            <input type='radio' id="silence" name="notes" checked={silence} onChange={handleChangeRadio} />
                            <label htmlFor="silence">Silence</label>
                        </div>
                    </div>
                    <div className={classes["notes-options"]}>
                        <Select className={classes["select"]} defaultValue={"Do 4"} onChange={handleNoteChange} disabled={silence ? true : false}>
                            {
                                availableNotes.map((note) => {
                                    return <MenuItem key={note} value={note} > {note} </MenuItem>
                                })
                            }
                        </Select>
                        <Select className={classes["select"]} defaultValue={"natural"} onChange={handleNotationChange} disabled={silence ? true : false}>
                            {
                                noteNotation.map((notation) => {
                                    return <MenuItem key={notation.name} value={notation.value} disabled={notation.disabled}> {notation.name} </MenuItem>
                                })
                            }
                        </Select>
                        <Select className={classes["select"]} defaultValue={"4"} onChange={handleDurationChange}>
                            {
                                durationType.map((duration) => {
                                    return <MenuItem key={duration.name} value={duration.value} > {duration.name} </MenuItem>
                                })
                            }
                        </Select>
                    </div>
                    <div className={ classes["ButtonContainer"] }>
                        <button className={ classes['SaveButton'] } onClick={addNote}>Add</button>
                    </div>
                </Modal> :
                <></>
            }
        </div>
    )
}