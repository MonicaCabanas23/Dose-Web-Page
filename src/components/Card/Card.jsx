import classes from './Card.module.scss';

export const Card = ({children, flex="false", column="false", padding="2rem"}) => {
    let cardClasses = [classes['Card']];
    if (flex === "true") {
        cardClasses = [...cardClasses, classes['flex-card']];

        if (column === "true") {
            cardClasses = [...cardClasses, classes['column']];
        }
    } 

    return (
        <div className={ cardClasses.join(" ") } style={{"--padding": padding}}>
            {children}
        </div>
    )
}