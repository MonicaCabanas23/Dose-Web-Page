import classes from './Song.module.scss';
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Form } from './Form';
import { SongNotes } from './SongNotes';
import { toast } from 'react-toastify';
import { MdOutlineArrowBackIos } from 'react-icons/md';

export const Song = () => {
    const {id} = useParams();    
    const [data, setData] = useState({});
    const [form, setForm] = useState(true);
    const navigate = useNavigate();
    const [info, setInfo] = useState({
        name: "",
        picture: [], 
        mp3: "",
        author: "",
        ppm: "", 
        notes: {}
    });

    useEffect(() => {
        if (id !== undefined) {
            getSong(id);
        }
    },[]);

    useEffect(() => {
        setInfo(data)
    }, [data])
    
    const getSong = (id) => {
        return fetch(`https://api.mingo.studio/api/song/one/${id}`, {
            method: "GET",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${useAuth().token}`
            }            
        })
        .then(
            response => response.json().then(data => {
                setData(data);
            })
        ).catch(() => {
        })
    }

    const goBack = () => {
        navigate("/songs");
    }

    const handleInfoChange = (object) => {
        setInfo(object)
    }

    const handleNextClick = () => {
        if (!info.name || !info.mp3 || !info.picture) {
            toast.error("Hay informacion sin rellenar", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }
        setForm(false);
    } 
    
    const handleSaveClick = async () => {
        // Get token from localstorage
        const dataStorage = useAuth()
        const token = dataStorage.token
        
        if(!info.notes || info.notes.length === 0) {
            toast.error("Hay información sin rellenar", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }

        if(id) {
            await fetch(`https://api.mingo.studio/api/song/${id}`, {
                method: "PUT",
                crossDomain:true,
                headers: {
                    "Content-Type" : "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*", 
                    "Authorization": `bearer ${token}`
                }, 
                body: JSON.stringify({
                    "name": info.name,
                    "author": info.author,
                    "ppm": info.ppm,
                    "picture": info.picture,
                    "mp3": info.mp3,
                    "notesData": info.notes
                })              
            })
            .then(response => response.json().then(data => {
                setData(data);
                

                if (data.error) {
                    throw new Error(data.error);
                }
    
                toast.success("Canción modificada!", {
                    hideProgressBar: true,
                    theme: "dark",
                    toastId: "Success",
                    pauseOnFocusLoss: false,
                    autoClose:3000
                });

                goBack()
                return;
            })
            ).catch((error) => {
                toast.error(`${error}`, {
                    hideProgressBar: true,
                    theme: "dark",
                    toastId: "Error",
                    pauseOnFocusLoss: false,
                    autoClose:3000
                });
            })
        } else {
            await fetch(`https://api.mingo.studio/api/song`, {
            method: "POST",
            crossDomain:true,
            headers: {
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*", 
                "Authorization": `bearer ${token}`
            }, 
            body: JSON.stringify({
                "name": info.name,
                "author": info.author,
                "ppm": info.ppm,
                "picture": info.picture,
                "mp3": info.mp3,
                "notes": info.notes
            })              
            })
            .then(response => response.json().then(data => {
                    setData(data);
                    

                    if (data.error) {
                        throw new Error(data.error);
                    }
        
                    toast.success("Canción creada!", {
                        hideProgressBar: true,
                        theme: "dark",
                        toastId: "Success",
                        pauseOnFocusLoss: false,
                        autoClose:3000
                    });

                    goBack()
                    return;
                })
            ).catch((error) => {
                toast.error(`${error}`, {
                    hideProgressBar: true,
                    theme: "dark",
                    toastId: "Error",
                    pauseOnFocusLoss: false,
                    autoClose:3000
                });
            })
        }
    }

    return (        
        <div className={ classes["Song"] }>
            <div className={ classes['Header'] }>
                <div className={ classes['Header-Title'] }>
                    <MdOutlineArrowBackIos onClick={goBack}/>
                    <span>{id ? data.name : "Add"}</span>
                </div>
                <div className={ classes['Header-Actions'] }>
                    <span onClick={ form ? handleNextClick : handleSaveClick }><u>{form ? "Next" : "Save"}</u></span>
                </div>
            </div>

            {
                form ? <Form info={info} setInfo={handleInfoChange} id={id}/> 
                : <SongNotes info={info} setInfo={handleInfoChange} id={id}/>  
            }
            
        </div>        
    )
}