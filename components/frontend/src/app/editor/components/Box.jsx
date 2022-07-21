import React from 'react';
import './Box.css';
import Draggable from 'react-draggable';
import {useXarrow} from 'react-xarrows';
import {Subscription} from "../../../api/subscription";
import {Function} from "../../../api/function";

const subClient = new Subscription();
const funcClient = new Function();

const Box = (props) => {
    const updateXarrow = useXarrow();
    const handleDrag = () => {
        props.setSubscriptions([...props.subscriptions]);
        props.setFunctions([...props.functions]);
    }
    const handleClick = (e) => {
        e.stopPropagation(); //so only the click event on the box will fire on not on the container itself
        if (props.actionState === 'Normal') {
            props.handleSelect(e);
        } else if (props.actionState === 'Add Connections' && props.selected.id !== props.box.id) {
            props.setLines((lines) => [
                ...lines,
                {
                    props: {start: props.selected.id, end: props.box.id},
                    menuWindowOpened: false,
                },
            ]);
        } else if (props.actionState === 'Remove Connections') {
            props.setLines((lines) =>
                lines.filter((line) => !(line.root === props.selected.id && line.end === props.box.id))
            );
        }
    };
    let background = null;
    if (props.selected && props.selected.id === props.box.id) {
        background = 'rgb(200, 200, 200)';
    } else if (
        (props.actionState === 'Add Connections' &&
            // props.sidePos !== "right" &&
            props.lines.filter((line) => line.root === props.selected.id && line.end === props.box.id).length === 0) ||
        (props.actionState === 'Remove Connections' &&
            props.lines.filter((line) => line.root === props.selected.id && line.end === props.box.id).length > 0)
    ) {
        background = 'LemonChiffon';
    }

    const onDeleteClick = async (e, el, type) => {
        if (window.confirm(`Are you sure you want to delete ${type} ${el.id}?`)) {
            switch (type) {
                case 'subscription':
                    try {
                        await subClient.remove(el.namespace, el.name).then(() => console.log('subscription deleted'))
                        window.location.reload();
                    } catch (e) {
                        alert('cannot delete the subscription'+ e.errorText)
                    }
                    break;
                case 'function':
                    try {
                        await funcClient.remove(el.namespace, el.id).then(() => console.log('function deleted'))
                        window.location.reload();
                    } catch (e) {
                        alert('cannot delete the function'+ e.errorText)
                    }
                    break;
            }
        }
    }

    let fields;
    switch (props.box.type) {
        case 'subscription':
            const sub = props.box
            const subFields = <div className="box-text">
                Subscription<strong> {sub.name}</strong>
                <span className="close-box" id={sub.name} onClick={e => onDeleteClick(e, sub, 'subscription')}>X</span>
                <ul className="small-list">
                    <li>Namespace: {sub.namespace}</li>
                    <li>Sink: {sub.sink}</li>
                    <li>Event Type: {sub.eventType}</li>
                </ul>
            </div>
            fields = subFields
            break
        case 'function':
            const func = props.box
            const funcFields = <div className="box-text">
                Function<strong> {func.id}</strong>
                <span className="close-box" id={func.id} onClick={e => onDeleteClick(e, func, 'function')}>X</span><br/>
                Namespace: {func.namespace}
                {/*<ul className="small-list">*/}
                {/*<li>Namespace: {func.namespace}</li>*/}
                {/*</ul>*/}
            </div>
            fields = funcFields
            break
    }

    return (
        <React.Fragment>
            <Draggable bounds="parent" onDrag={handleDrag}>
                <div
                    ref={props.box.reference}
                    className={`${props.box.type} ${props.position} hoverMarker`}
                    style={{
                        left: props.box.x,
                        top: props.box.y,
                        background,
                        border: "black solid 2px",
                    }}
                    onClick={handleClick}
                    id={props.box.name}>
                    {fields}
                </div>
            </Draggable>
            {/*{type === "middleBox" && menuWindowOpened ?*/}
            {/*  <MenuWindow setBoxes={props.setBoxes} box={props.box}/> : null*/}
            {/*}*/}
        </React.Fragment>
    );
};

export default Box;
