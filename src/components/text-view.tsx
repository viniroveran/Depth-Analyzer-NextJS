import React from "react";

const TextView = ({onChange, value}) => {
    return (
        <textarea
            className="textarea textarea-bordered w-full h-full"
            value={value}
            onChange={onChange}
        />
    );
}

export default TextView;