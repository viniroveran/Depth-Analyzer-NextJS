import React from "react";
import EditableItem from "./editable-item";

const TreeNode = ({ children, ...otherProps }) => {
    const hasChildren = children !== undefined;

    const renderChildren = (children) => {
        return (
            <ul>
                { children.map((nodeProps) => {
                    const { id, ...others } = nodeProps;
                    return (
                        <TreeNode 
                          key={id}
                          {...others}
                        />
                    );
                }) }
            </ul>
        );
    }        

    return (
        <li>
            <div className="m-1">
                <EditableItem {...otherProps} />
            </div>
            {hasChildren && renderChildren(children)}
        </li>
    );
}

export default TreeNode;