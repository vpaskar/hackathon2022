import React, {useState} from 'react';
import './editor.css';
import {Container} from "@mui/material";
import ResponsiveAppBar from "../components/header"
import TerminalController from "../components/terminal";
import EventSender from "../components/eventSender";
import Box from './components/Box';
import TopBar from './components/TopBar';
import Xarrow from './components/Xarrow';
import {Xwrapper} from 'react-xarrows';
import MenuWindow from './components/MenuWindow';
import TriggerButton from "./components/TriggerButton";
import Modal from "./components/Modal";
// import Subscription from "../../../api/subscription";
// import Function from "../../../api/function";
// const subClient = new Subscription();
// const funcClient = new Function();


// const shapes = ['Subscription', 'Function']
const shapes = [
    {
        name: 'Subscription',
        type: 'subscription',
    },
    {
        name: 'Function',
        type: 'function',
    },
];

const  funcFields = [
    {
        name: 'name',
        label: 'Function Name',
        type: 'text-input'
    },
];

const subFields = [
    {
        name: 'name',
        label: 'Subscription Name',
        type: 'text-input'
    },
    {
        name: 'sink',
        label: 'Sink',
        type: 'text-input'
    },
    {
        name: 'appName',
        label: 'Application Name',
        type: 'text-input'
    },
    {
        name: 'eventName',
        label: 'Event Name',
        type: 'text-input'
    },
    {
        name: 'eventVersion',
        label: 'Event version',
        type: 'select',
        options: ['v1', 'v2', 'v3']
    },
];

const Editor = () => {
    const [boxes, setBoxes] = useState([]);
    const [lines, setLines] = useState([]);

    // selected:{id:string,type:"arrow"|"box"}
    const [selected, setSelected] = useState(null);
    const [actionState, setActionState] = useState('Normal');

    const [showSubForm, setShowSubForm] = useState(false);
    const [showFuncForm, setShowFuncForm] = useState(false);

    const handleSelect = (e) => {
        if (e === null) {
            setSelected(null);
            setActionState('Normal');
        } else setSelected({id: e.target.id, type: 'box'});
    };

    const checkExistence = (id) => {
        return [...boxes].map((b) => b.id).includes(id);
    };
    const triggerText = 'Open form';
    const onSubmit = (event) => {
        event.preventDefault(event);
        console.log(event.target.name.value);
        console.log(event.target.email.value);
    };

    const handleDropDynamic = (e) => {
        let fetchedShape = e.dataTransfer.getData('shape');
        if (shapes.filter(shape => shape.name === fetchedShape)) {
            const shape = shapes.find(shape => shape.name === fetchedShape)
            let l = boxes.length;
            while (checkExistence('box' + l)) l++;
            let {x, y} = e.target.getBoundingClientRect();
            const promptMessage = 'Enter ' + shape.name + ' name: '
            const newName = prompt(promptMessage, 'box' + l);
            switch (shape.type) {
                case 'subscription':
                    setShowSubForm(true)
                    break;
                case 'function':
                    setShowFuncForm(true)
                    break;
            }
            if (newName) {
                let newBox = {id: newName, x: x, y: y, type: shape.type};
                setBoxes([...boxes, newBox]);
            }
        }
    };
    const props = {
        boxes,
        setBoxes,
        selected,
        handleSelect,
        actionState,
        setActionState,
        lines,
        setLines,
        showSubForm,
        showFuncForm,
        setShowSubForm,
        setShowFuncForm
    };

    const boxProps = {
        boxes,
        setBoxes,
        selected,
        handleSelect,
        actionState,
        setLines,
        lines,
    };

    const toggleScrollLock = () => {
        document.querySelector('html').classList.toggle('scroll-lock');
    };

    const showSubModal = () => {
        toggleScrollLock();
    };
    const closeSubModal = () => {
        toggleScrollLock();
        setShowSubForm(false);
    };

    const onSubModalSubmit = (event) => {
        event.preventDefault();
        const subPayload = {
            name: event.target.name.value,
            sink: event.target.sink.value,
            appName: event.target.appName.value,
            eventName: event.target.eventName.value,
            eventVersion: event.target.eventVersion.value,
        }
        console.log(subPayload)
    };
    const showFuncModal = () => {
        toggleScrollLock();
    };
    const closeFuncModal = () => {
        toggleScrollLock();
        setShowFuncForm(false);
    };

    const onFuncModalSubmit = (event) => {
        event.preventDefault();
        const funcPayload = {
            name: event.target.name.value,
        }
    };


    const subscriptionModal = <div><TriggerButton
        showModal={showSubModal}
        // buttonRef={(n) => (this.TriggerButton = n)}
    />
        <Modal
            onSubmit={onSubModalSubmit}
            fields={subFields}
            // modalRef={(n) => (this.modal = n)}
            // buttonRef={(n) => (this.closeButton = n)}
            closeModal={closeSubModal}
            // onKeyDown={this.onKeyDown}
            // onClickOutside={this.onClickOutside}
            headerText="Enter Subscription info:"
        /></div>

    const functionModal = <div><TriggerButton
        showModal={showFuncModal}
        // buttonRef={(n) => (this.TriggerButton = n)}
    />
        <Modal
            onSubmit={onFuncModalSubmit}
            fields={funcFields}
            // modalRef={(n) => (this.modal = n)}
            // buttonRef={(n) => (this.closeButton = n)}
            closeModal={closeFuncModal}
            headerText="Enter Function info:"
            // onKeyDown={this.onKeyDown}
            // onClickOutside={this.onClickOutside}
        /></div>

    return (
        <div>
            <h3>Playground </h3>
            <p className="playground-info">
                Info about the playground
            </p>
            <div id="form-container" className="hidden">
                {showSubForm === true && subscriptionModal}
                {showFuncForm === true && functionModal}
            </div>
            <Xwrapper>
                <div className="canvasStyle" id="canvas" onClick={() => handleSelect(null)}>
                    <div className="toolboxMenu">
                        <h3>Choose the resource with Drag & Drop</h3>
                        <div className="toolboxContainer">
                            {shapes.map((shape) => (
                                <div
                                    key={shape.name}
                                    className={shape.name.toLowerCase()}
                                    onDragStart={(e) => e.dataTransfer.setData('shape', shape.name)}
                                    draggable>
                                    {shape.name}
                                    {/* <div style={{ textAlign: "center" }}> {shapeName}</div>
                  <img src={shapeName2Icon[shapeName]} alt="SwitchIcon" className={"switchIcon"} /> */}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        id="boxesContainer"
                        className="boxesContainer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDropDynamic}>
                        <h3>Playground area</h3>

                        {boxes.map((box) => (
                            <Box {...boxProps} key={box.id} box={box} position="absolute" sidePos="right"/>
                        ))}
                    </div>

                    <TopBar {...props} />
                    {/* xarrow connections*/}
                    {lines.map((line, i) => (
                        <Xarrow
                            key={line.props.root + '-' + line.props.end + i}
                            line={line}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    ))}
                    {/* boxes menu that may be opened */}
                    {lines.map((line, i) =>
                        line.menuWindowOpened ? (
                            <MenuWindow key={line.props.root + '-' + line.props.end + i} setLines={setLines}
                                        line={line}/>
                        ) : null
                    )}
                </div>
            </Xwrapper>
        </div>
    );
};
export default Editor;
