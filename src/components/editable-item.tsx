import React from "react";

const EditableItem = (props) => {
    const { title, changeTitle, removeNode, addChild } = props;

    return (
        <div className="EditableItem">

            <button
                className="btn btn-circle btn-outline btn-primary"
                onClick={addChild}>
                +
            </button>

            <button className="btn btn-circle btn-outline btn-error"
                    onClick={removeNode}>
                x
            </button>

            <input
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => {
                    changeTitle(e.target.value)
                }}
                value={title}
                placeholder="New Item"
            />

        </div>
    );
}

export default EditableItem;