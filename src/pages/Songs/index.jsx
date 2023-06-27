import classes from './Songs.module.scss';
import { Table } from "../../components/Table/Table"
import { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import { Modal } from '../../components/Modal/Modal';
import { useAuth, useValidateToken } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Outlet, useOutlet } from 'react-router-dom';

export const Songs = () => {
    const [data, setData] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteElement, setDeleteElement] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation()
    const outlet = useOutlet();

    const fetchSongs = async  () => {
        setData([]);
        setLoading(true)
        await fetch("https://api.mingo.studio/api/song/", {
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
                setLoading(false)
            })
        ).catch(() => {
        })
    }

    useEffect(() => {
        if (!outlet) {
            fetchSongs();
        }        
    }, [location]);

    const addClick = () => {
        navigate('./song');
    }

    const editClick = (id) => {
        navigate(`./song/${id}`);
    }

    const openDeleteModal = (Song) => {
        setShowDelete(!showDelete);
        
        setDeleteElement({
                id: Song._id,
                note: Song.name
        });        
    }

    const handleDeleteClickSubmit = (e) => {
        if (!useValidateToken()) {
            toast.error("Sesión expirada", {
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

        fetch(`https://api.mingo.studio/api/song/${deleteElement.id}`, {
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
            fetchSongs();

            toast.success("Canción eliminada", {
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
                    <Table info={data} reloadClick={fetchSongs} addClick={addClick} editClick={editClick} deleteClick={openDeleteModal} isLoading={loading}/>
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