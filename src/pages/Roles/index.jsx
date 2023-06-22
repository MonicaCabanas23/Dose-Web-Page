import classes from './Roles.module.scss';

import { useEffect, useState } from 'react';
import { Card } from '../../components/Card/Card';
import { Input } from '../../components/Input/Input';
import { useAuth, useValidateToken } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

import { BiEditAlt, BiTrash } from 'react-icons/bi';
import { MdAdd } from 'react-icons/md';
import { Cards } from '../../components/Card/Cards/Cards';
import { Modal } from '../../components/Modal/Modal';

export const Roles = () => {
    const [data, setData] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [info, setInfo] = useState({});
    const [inputs, setInputs] = useState({
        type: ""
    });

    const fetchRoles = () => {
        return fetch("https://api.mingo.studio/api/userType/", {
            method: "GET",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",                
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
        fetchRoles();
    }, []);

    const handleClickEdit = (e) => {
        setShowEdit(!showEdit);
        if (e.currentTarget.id === "edit") {
            setInfo({
                id: e.currentTarget.getAttribute("data-id"),
                type: e.currentTarget.getAttribute("data-type")
            });            
            setInputs({
                type: e.currentTarget.getAttribute("data-type")
            });
        } else {
            setInfo({});
        }
    }

    const handleClickDelete = (e) => {
        setShowDelete(!showDelete);
        if (e.currentTarget.id === "delete") {
            setInfo({
                id: e.currentTarget.getAttribute("data-id"),
                type: e.currentTarget.getAttribute("data-type")
            });
        } else {
            setInfo({});
        }
    }

    const handleClickAdd = (e) => {        
        setShowAdd(!showAdd);
        setInputs({
            type: ""
        });
    }

    const handleEditClickSubmit = (e) => {
        if (inputs.type === "") {            
            toast.error("Ingrese el nombre del tipo de usuario!", {
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
        fetch(`https://api.mingo.studio/api/userType/${info.id}`, {
            method:"PUT",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `bearer ${useAuth().token}`
            },
            body: JSON.stringify({
                type: inputs.type,                
            }),
        })
        .then((res) => {
            return res.json();
        }).then((data) => {
            if (!data.error) {
                throw new Error(data.error);
            }
            
            setShowEdit(false);
            setInputs({});
            fetchRoles();
            toast.success("Rol modificado!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Success Modify",
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

        fetch(`https://api.mingo.studio/api/userType/${info.id}`, {
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
            if (!data.error) {
                throw new Error(data.error);
            }

            setShowDelete(false);
            fetchRoles();
            
            toast.success("Rol eliminado!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Success Delete",
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

    const handleAddClickSubmit = (e) => {
        if (inputs.type === "") {            
            toast.error("Ingrese el nombre del tipo de usuario!", {
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
        fetch(`https://api.mingo.studio/api/userType/`, {
            method:"POST",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `bearer ${useAuth().token}`
            },
            body: JSON.stringify({
                type: inputs.type,                
            }),
        })
        .then((res) => {            
            return res.json();
        }).then((data) => {
            if (!data.error) {
                throw new Error(data.error);
            }

            setShowAdd(false);
            setInfo({});
            fetchRoles();

            toast.success("Rol agregado!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Success Add",
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

    const setType = (e) => {
        setInputs(existingValues => ({
            ...existingValues,
            type: e.target.value
        }));
    }

    return (
        <Card flex="true">
            {data.map(
                roles => {
                    return (
                        <Cards key={roles._id}>
                            <div>
                                <span className={ classes["Span"] }>Role: </span><span className={ [classes["Span"], classes["Role-name"]].join(" ") }>{roles.type}</span>
                            </div>
                            <div className={ classes['Actions'] }>
                                <button onClick={handleClickEdit} id="edit" data-id={roles._id} data-type={roles.type}><BiEditAlt/></button>
                                <button onClick={handleClickDelete} id="delete" data-id={roles._id} data-type={roles.type}><BiTrash/></button>
                            </div>
                        </Cards>
                    );
                }
            )}

            <Modal handleClickOpen={handleClickEdit} show={showEdit}>
                <div><span className={ [classes["Span"], classes["Title"]].join(" ") }>Edit - </span><span className={ [classes["Span"], classes["Role-name"], classes["Title"]].join(" ") }>{info.type}</span></div>
                <Input id="fEdit" handleInput={setType} name="Edit" value={inputs.type} type="text"/>
                <button className={ classes['SaveButton'] } onClick={handleEditClickSubmit}>Edit</button>
            </Modal>

            <Modal handleClickOpen={handleClickDelete} show={showDelete} w="27.5rem" h="15rem">
                <div><span className={ [classes["Span"], classes["Title"]].join(" ") }>Delete - </span><span className={ [classes["Span"], classes["Role-name"], classes["Title"]].join(" ") }>{info.type}</span></div>
                <div className={ classes["ButtonContainer"] }>
                    <button className={ classes['SaveButton'] } onClick={handleDeleteClickSubmit}>Delete</button>
                </div>
            </Modal>

            <Modal handleClickOpen={handleClickAdd} show={showAdd}>
                <div><span className={ [classes["Span"], classes["Title"]].join(" ") }>Add Role</span></div>
                <Input id="fAdd" handleInput={setType} name="Add" value={inputs.type} type="text"/>
                <button className={ classes['SaveButton'] } onClick={handleAddClickSubmit}>Add</button>
            </Modal>

            <Cards add="true" onClick={handleClickAdd}>
                <MdAdd/>
            </Cards>
        </Card>
    )
}