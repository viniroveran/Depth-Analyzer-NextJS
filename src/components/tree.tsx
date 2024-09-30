"use client";

import React, {Component} from "react";
import TreeNode from "./tree-node";
import AddButton from "./add-button";
import TextView from "./text-view";

class Tree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nodes: this.initializedCopy(this.props.data),
            savedNodes: [],
        }
        this.changeTitle = this.changeTitle.bind(this);
        this.addRootElement = this.addRootElement.bind(this);
        this.addChild = this.addChild.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.saveState = this.saveState.bind(this);
        this.loadState = this.loadState.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.nodesToString = this.nodesToString.bind(this);
        this.exportToJson = this.exportToJson.bind(this);
    }

    initializedCopy(nodes, location) {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const {children, title} = nodes[i];
            const hasChildren = children !== undefined;
            const id = location ? `${location}.${i + 1}` : `${i + 1}`;
            nodesCopy[i] = {
                children: hasChildren ? this.initializedCopy(children, id) : undefined,
                changeTitle: this.changeTitle(id),
                removeNode: this.removeNode(id),
                addChild: this.addChild(id),
                id,
                title,
            };
        }
        return nodesCopy;
    }

    changeTitle(id) {
        return (newTitle) => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedCopy(this.state.nodes);
            let changingNode = nodes[id[0] - 1];

            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode.children[id[i] - 1];
                }
            }

            changingNode.title = newTitle;
            this.setState({nodes});
        };
    }

    addRootElement() {
        const id = this.state.nodes.length ? `${this.state.nodes.length + 1}` : "1";
        const newNode = {
            children: undefined,
            changeTitle: this.changeTitle(id),
            removeNode: this.removeNode(id),
            addChild: this.addChild(id),
            id,
            title: "",
        };

        const nodes = [...this.state.nodes, newNode];
        this.setState({nodes});
    }

    addChild(id) {
        return () => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedCopy(this.state.nodes);
            let changingNode = nodes[id[0] - 1];

            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode.children[id[i] - 1];
                }
            }

            if (changingNode.children === undefined) {
                changingNode.children = [];
            }

            id = `${id.join(".")}.${changingNode.children.length + 1}`;

            changingNode.children = [
                ...changingNode.children,
                {
                    children: undefined,
                    changeTitle: this.changeTitle(id),
                    removeNode: this.removeNode(id),
                    addChild: this.addChild(id),
                    id,
                    title: "",
                }];

            this.setState({nodes});
        }
    }

    removeNode(id) {
        return () => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedCopy(this.state.nodes);

            if (id.length === 1) {
                const newNodes = [
                    ...nodes.slice(0, [id[0] - 1]),
                    ...nodes.slice(id[0])
                ];

                this.setState({nodes: this.initializedCopy(newNodes)});

            } else {
                let changingNode = nodes[id[0] - 1];

                for (let i = 2; i < id.length; i++) {
                    changingNode = changingNode.children[id[i - 1] - 1];
                }

                const index = id[id.length - 1] - 1;

                const newChildren = [
                    ...changingNode.children.slice(0, index),
                    ...changingNode.children.slice(index + 1),
                ];
                changingNode.children = newChildren;

                this.setState({nodes: this.initializedCopy(nodes)});
            }
        }
    }

    saveState() {
        this.setState({savedNodes: this.initializedCopy(this.state.nodes)});
    }

    loadState() {
        this.setState({nodes: this.initializedCopy(this.state.savedNodes)});
    }

    onTextChange(e) {
        this.setState({nodes: this.initializedCopy(JSON.parse(e.target.value))});
    }

    nodesToString() {
        let output = [];
        let depth = 0;
        let parent = null;

        function recursion(obj, op, depth, parent) {
            if (typeof obj === 'object') {
                if (obj.title) {
                    depth++;
                    op.push({ title: obj.title, depth: depth, parent: parent })
                    parent = obj.title;
                }
                for (var key in obj) {
                    recursion(obj[key], op, depth, parent)
                }
                depth--;
            }
        }

        recursion(this.simplify(this.state.nodes), output, depth, parent)
        return JSON.stringify(output, undefined, 2);
    }

    exportToJson(e) {
        e.preventDefault()
        const blob = new Blob([this.nodesToString()], {type: 'text/json'})
        const a = document.createElement('a')
        a.download = 'dictionary.json'
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

    simplify(nodes) {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const {children, title} = nodes[i];
            const hasChildren = children !== undefined && children.length > 0;
            nodesCopy[i] = {
                title,
                children: hasChildren ? this.simplify(children) : undefined,
            };
        }
        return nodesCopy;
    }

    render() {
        const {nodes, savedNodes} = this.state;
        const {
            addRootElement, onTextChange, nodesToString, exportToJson
        } = this;

        return (
            <div className="flex flex-row">
                <div className="basis-1/2 h-fit">
                    <button className="btn btn-primary" type='button' onClick={exportToJson}>
                        Export to JSON
                    </button>
                    <ul>
                        {nodes.map((nodeProps) => {
                            const {id, ...others} = nodeProps;
                            return (
                                <TreeNode
                                    key={id}
                                    {...others}
                                />
                            );
                        })}
                    </ul>
                    <AddButton onClick={addRootElement}/>
                </div>

                <div className="basis-1/2 h-screen">
                    <TextView
                        value={nodesToString()}
                        onChange={onTextChange}
                    />
                </div>
            </div>
        );
    }
}

export default Tree;