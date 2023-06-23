import classes from './Users.module.scss';
import { Card } from "../../components/Card/Card";
import { Table } from '../../components/Table/Table';
import { Modal } from '../../components/Modal/Modal';

import { useAuth, useValidateToken } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const Users = () => {
    const [data, setData] = useState([]);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteElement, setDeleteElement] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setData([]);
        setLoading(true)
        return fetch("https://api.mingo.studio/api/user/", {
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
        fetchUsers();        
    }, []);

    const openDeleteModal = (User) => {
        setShowDelete(!showDelete);
        
        setDeleteElement({
            id: User._id,
            user: User.name,
            user_type_id: User.user_type_id
        });
    }

    const handleDeleteClickSubmit = (e) => {
        if (deleteElement.id === useAuth().user._id || deleteElement.user_type_id === "645fe7c77ed284fe0b735ba9") {
            toast.error("No puedes eliminar a este usuario", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Error",
                pauseOnFocusLoss: false,
                autoClose:3000
            });
            return;
        }

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

        fetch(`https://api.mingo.studio/api/user/${deleteElement.id}`, {
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
            fetchUsers();

            toast.success("Usuario eliminado!", {
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
        <Card>
            <Table info={data} reloadClick={fetchUsers} deleteClick={openDeleteModal} generateActions={true} allowAddEdit={false} isLoading={loading}/>
            <Modal handleClickOpen={openDeleteModal} show={showDelete} w="27.5rem" h="15rem">
                <div><span className={ [classes["Span"], classes["Title"]].join(" ") }>Delete - </span><span className={ [classes["Span"], classes["Role-name"], classes["Title"]].join(" ") }>{deleteElement.user}</span></div>
                <div className={ classes["ButtonContainer"] }>
                    <button className={ classes['SaveButton'] } onClick={handleDeleteClickSubmit}>Delete</button>
                </div>
            </Modal>
        </Card>
    )
}