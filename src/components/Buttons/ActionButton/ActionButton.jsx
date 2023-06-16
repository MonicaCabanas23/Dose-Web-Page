import classes from './ActionButton.module.scss';

import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import { HiOutlineHome } from 'react-icons/hi';
import { IoMusicalNoteOutline, IoMusicalNotesOutline } from 'react-icons/io5';
import { MdOutlinePiano, MdOutlineLibraryMusic, MdOutlineMenuBook, MdChecklist, MdOutlineAccountBox, MdOutlineAccountCircle } from 'react-icons/md';

export const ActionButton = ({url = "", name = "", icon=""}) => {
    const location = useLocation();
    const parentLocation = location.pathname.split("/")[1];    

    const icons = [
        {
            IconName: "HiOutlineHome",
            Icon: HiOutlineHome
        },
        {
            IconName: "IoMusicalNoteOutline",
            Icon: IoMusicalNoteOutline
        },
        {
            IconName: "IoMusicalNotesOutline",
            Icon: IoMusicalNotesOutline
        },
        {
            IconName: "MdOutlinePiano",
            Icon: MdOutlinePiano
        },
        {
            IconName: "MdOutlineLibraryMusic",
            Icon: MdOutlineLibraryMusic
        },
        {
            IconName: "MdOutlineMenuBook",
            Icon: MdOutlineMenuBook
        },
        {
            IconName: "MdChecklist",
            Icon: MdChecklist
        },
        {
            IconName: "MdOutlineAccountBox",
            Icon: MdOutlineAccountBox
        },
        {
            IconName: "MdOutlineAccountCircle",
            Icon: MdOutlineAccountCircle
        }
    ]

    const iconToUse = icons.filter(i => i.IconName === icon);    
    const Icon = iconToUse.length !== 0 ? iconToUse[0].Icon : "";
    const iconToUseElements = iconToUse.length !== 0 ? [
        <Icon key={ Icon } />,        
    ] : "";


    let classesButton = [classes["ActionButton"]];

    if (`/${parentLocation}` === url) {
        classesButton = [...classesButton, classes["activeActionButton"]];        
    }

    return (
        <>
            <Link to={`/${parentLocation}` === url ? "#" : url} className={ classesButton.join(" ") }>
                {iconToUseElements}{name}
            </Link>            
        </>
    )
}