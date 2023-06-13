import classes from './Roles.module.scss';

import { useEffect, useState } from 'react';
import { Card } from '../../components/Card/Card';
import { BiEditAlt, BiTrash } from 'react-icons/bi';
import { MdAdd } from 'react-icons/md';
import { Cards } from '../../components/Card/Cards/Cards';
import { Modal } from '../../components/modal/Modal';

export const Roles = () => {
    const [data, setData] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [info, setInfo] = useState({});

    const fetchRoles = () => {
        return fetch("https://api.mingo.studio/api/userType/", {
            method: "GET",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Acces-Control-Allow-Origin": "*",                
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
                <span className={ [classes["Span"], classes["Title"]].join(" ") }>Edit - </span><span className={ [classes["Span"], classes["Role-name"], classes["Title"]].join(" ") }>{info.type}</span>
                
            </Modal>

            <Modal handleClickOpen={handleClickDelete} show={showDelete}>
                <span className={ [classes["Span"], classes["Title"]].join(" ") }>Delete - </span><span className={ [classes["Span"], classes["Role-name"], classes["Title"]].join(" ") }>{info.type}</span>
            </Modal>

            <Cards add="true">
                <MdAdd/>
            </Cards>
        </Card>
    )
}