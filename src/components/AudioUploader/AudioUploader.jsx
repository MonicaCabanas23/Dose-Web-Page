import classes from './AudioUploader.module.scss'

import { useEffect, useRef, useState } from 'react';

import { BsFileEarmarkMusic } from 'react-icons/bs';
import { ItemButton } from "../Buttons/ItemButton/ItemButton";

export const AudioUploader = ({handleSaveClick, value=null}) => {
    const [audioFile, setAudioFile] = useState([]);
    const inputRef = useRef(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    const handleAudioUpload = (event) => {
        
        const file = event.target.files[0];        
        setAudioFile([
            file
        ]);
        setEditValue(null);
        
    };

    const handleClick = () => {
        // 👇️ open file input box on click of another element
        inputRef.current.click();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        // Handle the dropped files here, such as saving them to state
        setAudioFile(files);
    }; 

    return (
        <div className={ classes["Audio"] }>
            <input ref={inputRef} type="file" accept="audio/mp3" onChange={handleAudioUpload}/>
            <button 
            className={ classes["clickeable_drag"] } 
            onClick={handleClick} 
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}>
                Click or Drop Here
            </button>
            {
                editValue ? 
                <div className={ classes["Audio-Holder"] } key={new Date()}>
                    <div className={ classes["Audio-File-Holder"] }>
                        <div className={ classes["Audio-File"] }>
                            <div className={ classes["Audio-Icon"] }><BsFileEarmarkMusic/></div>
                            <audio controls>
                                
                                <source src={value}/>
                            </audio>
                        </div>
                    </div>
                </div>
                : 
                audioFile.map((audio, index) =>
                <div className={ classes["Audio-Holder"] } key={new Date()}>
                    <div className={ classes["Audio-File-Holder"] }>
                        {audio?.name}
                        <div className={ classes["Audio-File"] }>
                            <div className={ classes["Audio-Icon"] }><BsFileEarmarkMusic/></div>
                            <audio controls>
                                
                                <source src={URL.createObjectURL(audio)}/>
                            </audio>
                        </div>
                    </div>
                </div>
            )}
            <div className={classes["button_container"]}>
                <button className={classes["save_button"]} onClick={() => {handleSaveClick(audioFile)}}>Save</button>
            </div>
        </div>
    )
}