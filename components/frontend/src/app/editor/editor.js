import React, {useEffect, useState} from 'react';
import './editor.css';
import Box from './components/Box';
import TopBar from './components/TopBar';
import Xarrow from './components/Xarrow';
import {Xwrapper} from 'react-xarrows';
import MenuWindow from './components/MenuWindow';
import TriggerButton from "./components/TriggerButton";
import Modal from "./components/Modal";
import Function from "../../api/function";
import {Subscription} from "../../api/subscription";

const subClient = new Subscription();
const funcClient = new Function();

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

const funcFields = [
    {
        name: 'namespace',
        label: 'Namespace',
        type: 'text-input'
    },
];

const subFields = [
    {
        name: 'namespace',
        label: 'Namespace',
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

    const [currentName, setCurrentName] = useState("");

    const handleSelect = (e) => {
        if (e === null) {
            setSelected(null);
            setActionState('Normal');
        } else setSelected({id: e.target.id, type: 'box'});
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

    const checkExistence = (id) => {
        return [...boxes].map((b) => b.name).includes(id);
    };

    const handleDropDynamic = (e) => {
        let fetchedShape = e.dataTransfer.getData('shape');
        if (shapes.filter(shape => shape.name === fetchedShape)) {
            const shape = shapes.find(shape => shape.name === fetchedShape)
            let l = boxes.length;
            while (checkExistence(shape.type + l)) l++;
            let {x, y} = e.target.getBoundingClientRect();
            const promptMessage = 'Enter ' + shape.name + ' name: '
            const newName = prompt(promptMessage, shape.type + l);
            setCurrentName(newName)
            switch (shape.type) {
                case 'subscription':
                    setShowSubForm(true)
                    break;
                case 'function':
                    setShowFuncForm(true)
                    break;
            }
            if (newName) {
                let newBox = {id: newName, x: x, y: y, type: shape.type,};
                setBoxes([...boxes, newBox]);
            }
        }
    };

    // MODAL LOGIC

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
            name: currentName,
            namespace: event.target.namespace.value,
            sink: event.target.sink.value,
            appName: event.target.appName.value,
            eventName: event.target.eventName.value,
            eventVersion: event.target.eventVersion.value,
        }
        try {
            subClient.create(subPayload)
        } catch (e) {
            console.log('cannot save the sub', e)
        }
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
            name: currentName,
            namespace: event.target.namespace.value,
        }
        try {
            funcClient.create(funcPayload)
        } catch (e) {
            console.log('cannot save the sub', e)
        }
    };

    const subscriptionModal = <div>
        <TriggerButton
            showModal={showSubModal}
        />
        <Modal
            onSubmit={onSubModalSubmit}
            fields={subFields}
            closeModal={closeSubModal}
            headerText={"Enter info for " + currentName}
        />
    </div>

    const functionModal = <div>
        <TriggerButton
            showModal={showFuncModal}
        />
        <Modal
            onSubmit={onFuncModalSubmit}
            fields={funcFields}
            closeModal={closeFuncModal}
            headerText={"Enter info for " + currentName}
        />
    </div>

    // subscription actions
    const getSubscriptions = async () => {
        const editorBox = document.getElementById("boxesContainer")
        const editorBoxRect = editorBox.getBoundingClientRect();

        const subscriptions = await subClient.list()
        subscriptions.data.items.map((subscription, i) => {
            let newBox = {id: subscription.metadata.name, x: editorBoxRect.left*i, y: i * 50, type: "subscription",};
            boxes.push(newBox)
        })
        console.log(boxes)
        setBoxes(boxes)
        console.log(boxes)
    };


    // subscription actions
    const getFunctions = async () => {
        const editorBox = document.getElementById("boxesContainer")
        const editorBoxRect = editorBox.getBoundingClientRect();

        const functions = await funcClient.list()
        functions.data.items.map((func, i) => {
            let newBox = {id: func.metadata.name, x: editorBoxRect.left*i, y:100+ i * 50, type: "function",};
            boxes.push(newBox)
        })
        console.log(boxes)
        setBoxes(boxes)
        console.log(boxes)
    };

    const MINUTE_MS = 5000;
    // getSubscriptions().then(()=>console.log('Subscriptions\' list updated!'))
    // getFunctions().then(()=>console.log('Functions\' list updated!'))
    useEffect(() => {
        const interval = setInterval(() => {
            setBoxes([])
            // getSubscriptions().then(()=>console.log('Subscriptions\' list updated!'))
            // getFunctions().then(()=>console.log('Functions\' list updated!'))
        }, MINUTE_MS);
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

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
    )
        ;
};
export default Editor;
