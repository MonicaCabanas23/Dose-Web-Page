import classes from './Menu.module.scss';

import { ActionButton } from './../../../components/Buttons/ActionButton/ActionButton';
import { Logout } from '../../../components/Buttons/Logout/Logout';

export const Navigation = ({menuState=false}) => {
  return (
    <nav className={ menuState ? [classes['Menu'], classes['active']].join(" ") : classes['Menu'] }>
        <ActionButton url="/Home" name="Home" icon="HiOutlineHome"/>
        <ActionButton url="/notes" name="Notes" icon="IoMusicalNoteOutline"/>
        <ActionButton url="/chords" name="Chords" icon="IoMusicalNotesOutline"/>
        <ActionButton url="/intervals" name="Intervals" icon="MdOutlinePiano"/>
        <ActionButton url="/songs" name="Songs" icon="MdOutlineLibraryMusic"/>
        <ActionButton url="/roles" name="Roles" icon="MdChecklist"/>
        <ActionButton url="/users" name="Users" icon="MdOutlineAccountBox"/>
        <ActionButton url="/avatars" name="Avatars" icon="MdOutlineAccountCircle"/>
        <br/>
        <Logout classesProp={["Logout", "Menu-Logout"]}/>
    </nav>
  )
}