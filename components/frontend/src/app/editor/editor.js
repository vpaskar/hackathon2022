import React, {useEffect, useState} from 'react';
import './editor.css';
import Box from './components/Box';
import TopBar from './components/TopBar';
import Xarrow from './components/Xarrow';
import {Xwrapper} from 'react-xarrows';
import MenuWindow from './components/MenuWindow';
import TriggerButton from "./components/TriggerButton";
import Modal from "./components/Modal";
import { Function } from "../../api/function";
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
        name: 'name',
        label: 'Name',
        type: 'text-input'
    },
    {
        name: 'namespace',
        label: 'Namespace',
        type: 'text-input'
    },
];

const subFields = [
    {
        name: 'name',
        label: 'Name',
        type: 'text-input'
    },
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
    const [subscriptions, setSubscriptions] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [lines, setLines] = useState([]);

    const [selected, setSelected] = useState(null);
    const [actionState, setActionState] = useState('Normal');

    const [showSubForm, setShowSubForm] = useState(false);
    const [showFuncForm, setShowFuncForm] = useState(false);

    const [pendingSub, setPendingSub] = useState({});
    const [pendingFunc, setPendingFunc] = useState({});

    const handleSelect = (e) => {
        if (e === null) {
            setSelected(null);
            setActionState('Normal');
        } else setSelected({id: e.target.id, type: 'box'});
    };

    const props = {
        subscriptions,
        setSubscriptions,
        functions,
        setFunctions,
        selected,
        pendingSub,
        setPendingSub,
        pendingFunc,
        setPendingFunc,
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
        subscriptions,
        setSubscriptions,
        functions,
        setFunctions,
        selected,
        handleSelect,
        actionState,
        setLines,
        lines,
    };

    const handleSubscriptionDrop = (e) => {
        let shapeToCreate = e.dataTransfer.getData('shape');
        if (shapes.filter(shape => shape.name === shapeToCreate)) {
            let currentSub = e.target.getBoundingClientRect();
            setPendingSub(currentSub)
            setShowSubForm(true)
        }
    };

    const handleFunctionDrop = (e) => {
        let shapeToCreate = e.dataTransfer.getData('shape');
        if (shapes.filter(shape => shape.name === shapeToCreate)) {
            let currentFunc = e.target.getBoundingClientRect();
            setPendingFunc(currentFunc)
            setShowFuncForm(true)
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

    const onSubModalSubmit = async (event) => {
        event.preventDefault();
        const subPayload = {
            name: event.target.name.value,
            namespace: event.target.namespace.value,
            sink: event.target.sink.value,
            appName: event.target.appName.value,
            eventName: event.target.eventName.value,
            eventVersion: event.target.eventVersion.value,
            x: pendingSub.x,
            y: pendingSub.y,
        }
        try {
            await subClient.create(subPayload)
            setShowSubForm(false)
            window.location.reload();
        } catch (e) {
            console.log('cannot save the subscription', e)
        }
    };
    const showFuncModal = () => {
        toggleScrollLock();
    };
    const closeFuncModal = () => {
        toggleScrollLock();
        setShowFuncForm(false);
    };

    const onFuncModalSubmit = async (event) => {
        event.preventDefault();
        const funcPayload = {
            name: event.target.name.value,
            namespace: event.target.namespace.value,
        }
        try {
            await funcClient.create(funcPayload)
            setFunctions(functions => [...functions, funcPayload])
            window.location.reload();
        } catch (e) {
            console.log('cannot save the function', e)
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
            headerText={"Enter info for subscription:"}
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
            headerText={"Enter info for function:"}
        />
    </div>

    // subscription actions
    const getSubscriptions = async () => {
        setSubscriptions([])
        const subscriptions = await subClient.list()
        subscriptions.data.items.map((subscription, i) => {
            let newSub = {
                id: subscription.metadata.name,
                name: subscription.metadata.name,
                namespace: subscription.metadata.namespace,
                sink: subscription.spec.sink,
                eventType: subscription.spec.filter.filters[0].eventType.value,
                type: "subscription",
            };
            setSubscriptions(subscriptions => [...subscriptions, newSub])
            const connectedTo = funcClient.getFunctionNameBySink(newSub.sink)
            const newLine = {
                props: {
                   start: newSub.name,
                   end: connectedTo,
                },
            }
            setLines(lines => [...lines, newLine])
            // console.log("subscription %s is connected to function %s", newSub.name, connectedTo)
        })
    };


    const getFunctions = async () => {
        setFunctions([])
        const functions = await funcClient.list()

        functions.data.map((func, i) => {
            let newBox = {
                id: func.name,
                namespace: func.namespace,
                type: "function",
            };
            setFunctions(functions => [...functions, newBox])

        })
    };

    useEffect(() => {
        getSubscriptions().then(() => console.log('Subscriptions\' list updated!'))
        getFunctions().then(() => console.log('Functions\' list updated!'))
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
                        className="boxesContainer">
                        <h3>Playground area</h3>
                        <div
                            className="subscription-container"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleSubscriptionDrop}
                        >
                            <h4>Subscription Area</h4>
                            {subscriptions.map((subscription) => (
                                <Box {...boxProps} className="sub-box" box={subscription} sidePos="right"/>
                            ))}
                        </div>
                        <div
                            className="function-container"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFunctionDrop}
                        >
                            <h4>Function Area</h4>
                            {functions.map((func) => (
                                <Box {...boxProps} className="sub-box" box={func} sidePos="right"/>
                            ))}
                        </div>
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
