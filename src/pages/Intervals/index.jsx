import classes from './Intervals.module.scss';
import { useState, useEffect } from 'react';
import { Card } from '../../components/Card/Card';
import { Table } from '../../components/Table/Table';
import { Modal } from '../../components/Modal/Modal';
import { useAuth, useValidateToken } from '../../hooks/useAuth';
import { useNavigate, useLocation, Outlet, useOutlet } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Intervals = () => {
    const [data, setData] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteElement, setDeleteElement] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation()
    const outlet = useOutlet();

    const fetchIntervals = () => {
        setData([]);
        setLoading(true);
        return fetch("https://api.mingo.studio/api/interval/", {
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
                setLoading(false);
            })
        ).catch(() => {
        })
    }

    useEffect(() => {
        if (!outlet) {
            fetchIntervals();
        }        
    }, [location]);

    const addClick = () => {
        navigate('./interval');
    }

    const editClick = (id) => {
        navigate(`./interval/${id}`);
    }

    const openDeleteModal = (Interval) => {
        setShowDelete(!showDelete);
        
        setDeleteElement({
            id: Interval._id,
            interavl: Interval.name
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

        fetch(`https://api.mingo.studio/api/interval/${deleteElement.id}`, {
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
            fetchIntervals();

            toast.success("Intervalo eliminado!", {
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
                <Card flex="true" column="true">
                    <Table info={data} reloadClick={fetchIntervals} addClick={addClick} editClick={editClick} deleteClick={openDeleteModal} isLoading={loading}/>
                    <Modal handleClickOpen={openDeleteModal} show={showDelete} w="27.5rem" h="15rem">
                        <div><span className={ [classes["Span"], classes["Title"]].join(" ") }>Delete - </span><span className={ [classes["Span"], classes["Role-name"], classes["Title"]].join(" ") }>{deleteElement.interval}</span></div>
                        <div className={ classes["ButtonContainer"] }>
                            <button className={ classes['SaveButton'] } onClick={handleDeleteClickSubmit}>Delete</button>
                        </div>
                    </Modal>
                </Card>
        }
        </>
    )
}