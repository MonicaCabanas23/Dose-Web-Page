import classes from './Note.module.scss';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import { Input } from '../../../components/Input/Input';
import { MdOutlineArrowBackIos } from 'react-icons/md';

export const Note = () => {
    const {id} = useParams();
    const [data, setData] = useState({});
    const [info, setInfo] = useState({
        name: "",
        picture: ""
    });
    const navigate = useNavigate();
    
    const getNote = (id) => {
        return fetch(`https://api.mingo.studio/api/musicalNote/one/${id}`, {
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

    const setDataInfo = () => {
        setInfo({
            name: data.name,
            picture: data.picture,
        });
    }

    useEffect(() => {
        if (id !== undefined) {
            getNote(id);
            
        }
    },[]);
    
    useEffect(() => {
        setDataInfo();
    }, [data]);

    const goBack = () => {
        navigate("/notes");
    }

    const setNote = (e) => {
        setInfo(existingValues => ({
            ...existingValues,
            name: e.target.value
        }));
    }

    return (
        <div className={ classes["Note"] }>
            <div className={ classes['Header'] }>
                <div className={ classes['Header-Title'] }>
                    <MdOutlineArrowBackIos onClick={goBack}/>
                    <span>{id ? data.name : "Add"}</span>
                </div>
                <div className={ classes['Header-Actions'] }>                    
                    <span><u>{id ? "Edit" : "Save"}</u></span>
                </div>
            </div>

            <div className={ classes["Input-Container"] }>
                <Input id="fInput" handleInput={setNote} name="Name" value={info.name} type="text"/>            
            </div>

            <div className={ classes["Uploaders"] }>
                <div className={ classes["Uploader"] }>

                </div>
                <div className={ classes["Uploader"] }>

                </div>
            </div>
        </div>
    )
}