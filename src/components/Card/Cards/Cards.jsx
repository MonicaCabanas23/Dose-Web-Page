import classes from './Cards.module.scss';

export const Cards = ({ children, add="false" }) => {    
    return (
        <div className={ add === "false" ? classes['Cards'] : [classes['Cards'], classes['CardAdd']].join(" ") }>
            { children }
        </div>
    )
}