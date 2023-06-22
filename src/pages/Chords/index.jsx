import classes from './Chords.module.scss';
import { Table } from "../../components/Table/Table"
import { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import { Modal } from '../../components/Modal/Modal';
import { useAuth, useValidateToken } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet, useOutlet } from 'react-router-dom';


export const Chords = () => {
    const [data, setData] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteElement, setDeleteElement] = useState({});
    const navigate = useNavigate();
    const location = useLocation()
    const outlet = useOutlet();

    const fetchChords = async  () => {
        setData([]);
        await fetch("https://api.mingo.studio/api/chord/", {
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
        if (!outlet) {
            fetchChords();
        }        
    }, [location]);

    const addClick = () => {
        navigate('./chord');
    }

    const editClick = (id) => {
        navigate(`./chord/${id}`);
    }

    const openDeleteModal = (Chord) => {
        setShowDelete(!showDelete);
        
        setDeleteElement({
                id: Chord._id,
                note: Chord.name
        });        
    }

    const handleDeleteClickSubmit = (e) => {
        if (!useValidateToken()) {
            alert("Token expired");
            return;
        }

        e.preventDefault();
        e.target.disabled = true;

        fetch(`https://api.mingo.studio/api/chord/${deleteElement.id}`, {
            method:"DELETE",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `bearer ${useAuth().token}`
            }
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Something went wrong');
            }
            return res.json();
        }).then((data) => {
            setShowDelete(false);
            fetchChords();
            alert("Acorde eliminado");
            e.target.disabled = false;
            return;
        }).catch((error) => {
            alert(error);
        });
    }
    
    return (
        <>
        {
            outlet ? 
                <Card flex="true" column="true" padding='0rem'>
                    <Outlet/>
                </Card> 
                : 
                <Card>
                    <Table info={data} reloadClick={fetchChords} addClick={addClick} editClick={editClick} deleteClick={openDeleteModal}/>
                    <Modal handleClickOpen={openDeleteModal} show={showDelete} w="27.5rem" h="15rem">
                        <div><span className={ [classes["Span"], classes["Title"]].join(" ") }>Delete - </span><span className={ [classes["Span"], classes["Role-name"], classes["Title"]].join(" ") }>{deleteElement.note}</span></div>
                        <div className={ classes["ButtonContainer"] }>
                            <button className={ classes['SaveButton'] } onClick={handleDeleteClickSubmit}>Delete</button>
                        </div>
                    </Modal>
                </Card>
        }
        </>
    )
}