import React from 'react';

export const Form = ({onSubmit, fields}) => {
    console.log(fields)
    const createElement = (field) => {
        switch (field.type) {
            case 'text-input':
                return <div className="form-group">
                    <label htmlFor={field.name}>{field.label}:</label>
                    <input type="text" id={field.name} className="form-control" required="true"/>
                </div>
            case 'select':
                return <div className="form-group"><label htmlFor={field.name}>{field.label}</label>
                    <select name={field.name} id={field.name} required="true">
                        {field.options.map((option) => (
                            <option value={option}>{option}</option>
                        ))}
                    </select></div>
        }
        return "";
    };


    return (
        <form onSubmit={onSubmit}>
            {
                fields.map((field) => (
                    createElement(field)
                ))
            }
            <div className="form-group">
                <button className="form-control btn btn-primary" type="submit">
                    Submit
                </button>
            </div>
        </form>
    );
};
export default Form;
