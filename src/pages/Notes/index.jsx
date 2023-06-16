import classes from './Notes.module.scss';
import { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import { Table } from '../../components/Table/Table';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Outlet, useOutlet } from 'react-router-dom';

export const Notes = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const outlet = useOutlet();

    const fetchNotes = () => {
        setData([]);
        return fetch("https://api.mingo.studio/api/musicalNote/", {
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

    useEffect(() => {
        fetchNotes();
    }, []);

    const addClick = () => {
        navigate('./note');
    }

    const editClick = (id) => {
        navigate(`./note/${id}`);
    }

    return (
        <>
        {
            outlet ? 
                <Card flex="true" column="true" padding='0rem'>
                    <Outlet/>
                </Card> 
                : <Card><Table info={data} reloadClick={fetchNotes} addClick={addClick} editClick={editClick}/></Card>
        }
        </>
    )
}