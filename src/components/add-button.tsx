import React from "react";

const AddButton = ( {onClick} ) => {
    return (
        <div>
            <button
                className="btn btn-circle btn-primary"
                onClick={onClick}
                value>
                +
            </button>
        </div>
    );
}

export default AddButton;