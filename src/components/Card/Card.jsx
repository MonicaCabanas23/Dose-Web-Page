import classes from './Card.module.scss';

export const Card = ({children, flex="false"}) => {
    return (
        <div className={ flex === "false" ? classes['Card'] : [classes['Card'], classes['flex-card']].join(" ") }>
            {children}
        </div>
    )
}