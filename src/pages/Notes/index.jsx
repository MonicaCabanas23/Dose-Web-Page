import classes from './Notes.module.scss';
import { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import { Table } from '../../components/Table/Table';
import { Modal } from '../../components/Modal/Modal';
import { useAuth, useValidateToken } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet, useOutlet } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Notes = () => {
    const [data, setData] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteElement, setDeleteElement] = useState({});
    const navigate = useNavigate();
    const location = useLocation()
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
        if (!outlet) {
            fetchNotes();
        }        
    }, [location]);

    const addClick = () => {
        navigate('./note');
    }

    const editClick = (id) => {
        navigate(`./note/${id}`);
    }

    const openDeleteModal = (Note) => {
        setShowDelete(!showDelete);
        
        setDeleteElement({
                id: Note._id,
                note: Note.name
        });        
    }

    const handleDeleteClickSubmit = (e) => {
        if (!useValidateToken()) {
            toast.error("Sesion expirada!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }

        e.preventDefault();
        e.target.disabled = true;

        fetch(`https://api.mingo.studio/api/musicalNote/${deleteElement.id}`, {
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
            return res.json();
        }).then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }

            setShowDelete(false);
            fetchNotes();

            toast.success("Nota eliminada!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Success",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            
            e.target.disabled = false;
            return;
        }).catch((error) => {
            toast.error(`${error}`, {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
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
                    <Table info={data} reloadClick={fetchNotes} addClick={addClick} editClick={editClick} deleteClick={openDeleteModal}/>
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