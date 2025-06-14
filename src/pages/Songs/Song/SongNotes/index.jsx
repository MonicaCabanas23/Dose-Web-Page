import classes from "./SongNotes.module.scss";
import { Cards } from "../../../../components/Card/Cards/Cards";
import { MdAdd } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { Select, MenuItem } from "@mui/material";
import { Modal } from "../../../../components/Modal/Modal";
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";

export const SongNotes = ({ info, setInfo, id}) => {
    let i = 0
    const [data, setData] = useState([])
    // Flags if the user has edited or added
    const [isEditing, setIsEditing] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    // Logical use flags
    const [showEdit, setShowEdit] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [note, setNote] = useState(true)
    const [silence, setSilence] = useState(false)
    const [flat, setFlat] = useState(false)
    const [sharp, setSharp] = useState(true)
    // Selected Item 
    const [index, setIndex] = useState(0)
    // For saving the symbol
    const [noteName, setNoteName] = useState("Do 4")
    const [selectedNote, setSelectedNote] = useState("Do 4")
    const [selectedNotation, setSelectedNotation] = useState("natural")
    const [selectedDuration, setSelectedDuration] = useState(4)
    const [durationValue, setDurationValue] = useState((60/info.ppm) * 4)
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
        if(note && (selectedNotation === "bemol" || selectedNotation === "#")) {

            if(selectedNotation === "bemol" &&  (selectedNote === "Fa 4" || selectedNote === "Fa 5" || selectedNote === "Do 4" || selectedNote === "Do 5")) {
                setSelectedNotation("natural")
                return;
            } 
            else if (selectedNotation === "#" && (selectedNote === "Mi 4" || selectedNote === "Mi 5" || selectedNote === "Si 4")) {
                setSelectedNotation("natural")
                return;
            }

            const _noteName = selectedNote.match(/^\w+/g)
            const numberNote = selectedNote.match(/\w+$/g)
            const newName = _noteName + " " + selectedNotation + " " + numberNote
            setNoteName(newName)
            return;

        } else if(note) {
            setNoteName(selectedNote)
            return

        } else if(silence) {
            setNoteName("Silence")
            return
        }

    }, [selectedNotation, selectedNote, note, silence])

    useEffect(() => {
        // Duration of a note depending of the time of note it is (black, white, corchea, etc)
        const unitTime = Math.trunc((60 / info.ppm) * 1000)
        const duration = (selectedDuration * unitTime)

        setDurationValue(duration)

    }, [selectedDuration])

    useEffect(() => {
        setInfo(existingValues => ({
            ...existingValues,
            notes: data
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
    }

    const handleNoteChange = (e) => {
        if(e.target.value === "Mi 4" || e.target.value === "Mi 5" || e.target.value === "Si 4") {
            setSharp(false)
            setFlat(true)

            // Update the note
            setSelectedNote(e.target.value)

            return;
        }
        else if(e.target.value === "Fa 4" || e.target.value === "Fa 5" || e.target.value === "Do 4" || e.target.value === "Do 5") {
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
        setSelectedNotation(e.target.value)
    }

    const handleDurationChange = (e) => {
        setSelectedDuration(e.target.value)
    }

    const handleClickEdit = (i) => {
        setShowEdit(!showEdit)
        setIndex(i);
        setIsEditing(true)
        if(isAdding) {
            clearData
        }

        const _selectedSymbol = data[i]

        if(_selectedSymbol) {

            const symbolName = _selectedSymbol.symbol.match(/^\w+/g)
            const symbolNumber = _selectedSymbol.symbol.match(/\w+$/g)
    
            if(symbolNumber && symbolName[0] != "Silence") {
                const _selectedNote = symbolName[0] +  " " + symbolNumber[0]

                if(_selectedNote === "Mi 4" || _selectedNote === "Mi 5" || _selectedNote === "Si 4") {
                    console.log(_selectedNote, flat)
                    setFlat(true)
                    setSharp(false)
                } else if(_selectedNote === "Fa 4" || _selectedNote === "Fa 5" || _selectedNote === "Do 4" || _selectedNote === "Do 5") {
                    setSharp(true)
                    setFlat(false)
                } else {
                    setSharp(true)
                    setFlat(true)
                }
                
                setSelectedNote(_selectedNote)

            } else {
                setNote(false)
                setSilence(true)
            }
    
            const symbolNotation = _selectedSymbol.symbol.match(/(#)+|(bemol)+/g)

            if(!symbolNotation) {
                setSelectedNotation("natural")
            } else {
                setSelectedNotation(symbolNotation[0])
            }

            let symbolDuration 

            if(_selectedSymbol.duration.$numberDecimal) {
                symbolDuration = Math.trunc(_selectedSymbol.duration.$numberDecimal)
            } else {
                symbolDuration = Math.trunc(_selectedSymbol.duration)
            }

            switch (symbolDuration) {
                case (Math.trunc((60/info.ppm) * 1000 * 4)): 
                    setSelectedDuration(4)
                    break;
                case (Math.trunc((60/info.ppm) * 1000 * 2)): 
                    setSelectedDuration(2)
                    break;
                case (Math.trunc((60/info.ppm) * 1000 * 1)): 
                    setSelectedDuration(1)
                    break;
                case (Math.trunc((60/info.ppm) * 1000 * 0.5)): 
                    setSelectedDuration(0.5)
                    break;
                case (Math.trunc((60/info.ppm) * 1000 * 0.25)): 
                    setSelectedDuration(0.25)
                    break;
                case (Math.trunc((60/info.ppm) * 1000 * 0.125)): 
                    setSelectedDuration(0.125)
                    break;
                default:
                    toast.error("Los valores no concuerdan", {
                        hideProgressBar: true,
                        theme: "dark",
                        toastId: "Error",
                        pauseOnFocusLoss: false,
                        autoClose:3000
                    });
                    break;
            }
        }
    }

    const handleClickDelete = (i) => {
        setShowDelete(!showDelete)
        setIndex(i);
    }

    const handleClickAdd = () => {
        setShowAdd(!showAdd);
        setIsAdding(true);
        if(isEditing) {
            clearData()
        }
    }

    const editNote = () => {
        const noteObject = {
            "symbol": noteName,
            "duration": durationValue
        }

        let _data = data
        _data[index] = noteObject
        setData(_data)

        toast.success("Nota editada exitosamente", {
            hideProgressBar: true,
            theme: "dark",
            pauseOnFocusLoss: false,
            autoClose:3000
        });

        setShowEdit(false) 
        clearData()
        setIsEditing(false)
    }

    const deleteNote = () => {
        data.splice(index, 1)

        setShowDelete(!showDelete);
        toast.success("Nota eliminada exitosamente", {
            hideProgressBar: true,
            theme: "dark",
            pauseOnFocusLoss: false,
            autoClose:3000
        });
    }

    const addNote = () => {
        const noteObject = {
            "symbol": noteName,
            "duration": durationValue
        }
        
        let _data = data
        _data.push(noteObject)
        setData(_data)

        toast.success("Nota agregada exitosamente", {
            hideProgressBar: true,
            theme: "dark",
            pauseOnFocusLoss: false,
            autoClose:3000
        });

        setShowAdd(false)
        clearData()
        setIsAdding(false)
    }

    const clearData = () => {
        setSelectedNote("Do 4");
        setSelectedNotation("natural"); 
        setSelectedDuration(4);
        setNote(true);
        setSilence(false);
        setFlat(false); 
        setSharp(true);
    }


    return (
        <div className={classes["cards-container"]}>
            {data ? 
                data.map(
                    (note, index) => {
                        return (
                            <Cards key={index}>
                                <div>
                                    <span className={ classes["Span"] }>{note.symbol}</span>
                                </div>
                                <div className={ classes['Actions'] }>
                                    <button onClick={() => {handleClickEdit(index)}} ><BiEditAlt/></button>
                                    <button onClick={() => {handleClickDelete(index)}} ><BiTrash/></button>
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
                        <Select className={classes["select"]} value={selectedNote ?? "Do 4"} onChange={handleNoteChange} disabled={silence ? true : false}>
                            {
                                availableNotes.map((note) => {
                                    return <MenuItem key={note} value={note} > {note} </MenuItem>
                                })
                            }
                        </Select>
                        <Select className={classes["select"]} value={selectedNotation ?? "natural"} onChange={handleNotationChange} disabled={silence ? true : false}>
                            {
                                noteNotation.map((notation) => {
                                    return <MenuItem key={notation.name} value={notation.value} disabled={notation.disabled}> {notation.name} </MenuItem>
                                })
                            }
                        </Select>
                        <Select className={classes["select"]} value={selectedDuration ?? 4} onChange={handleDurationChange}>
                            {
                                durationType.map((duration) => {
                                    return <MenuItem key={duration.name} value={duration.value} > {duration.name} </MenuItem>
                                })
                            }
                        </Select>
                    </div>
                    <div className={ classes["ButtonContainer"] }>
                        <button className={ classes['SaveButton'] } onClick={editNote}>Save</button>
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