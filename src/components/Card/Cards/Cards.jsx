import classes from './Cards.module.scss';

export const Cards = ({ children, add="false", onClick }) => {    
    return (
        <div className={ add === "false" ? classes['Cards'] : [classes['Cards'], classes['CardAdd']].join(" ") } onClick={onClick}>
            { children }
        </div>
    )
}