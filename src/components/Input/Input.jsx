import classes from './Input.module.scss';

export const Input = ({id, handleInput, value, name, type}) => {
    return (
        <div className={ classes["InputContainer"]}>
            <input
                type={type}
                id={id}
                name={id}
                defaultValue={value}
                aria-labelledby={"label-${id}"}
                onInput={handleInput}
            />
            <label className={ classes["InputLabel"]} htmlFor={id} id={"label-${id}"}>
                <div className={ classes["LabelText"] }>{name}</div>
            </label>
        </div>
    )
}