import React, {useEffect, useState} from 'react';
import './editor.css';
import Box from './components/Box';
import Xarrow from './components/Xarrow';
import {Xwrapper} from 'react-xarrows';
import TriggerButton from "./components/TriggerButton";
import Modal from "./components/Modal";
import {Function} from "../../api/function";
import {Subscription} from "../../api/subscription";

const subClient = new Subscription();
const funcClient = new Function();

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

    const handleSelect = (e) => {
        if (e === null) {
            setSelected(null);
            setActionState('Normal');
        } else setSelected({id: e.target.id, type: 'box'});
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
            setShowSubForm(true)
        }
    };

    const handleFunctionDrop = (e) => {
        let shapeToCreate = e.dataTransfer.getData('shape');
        if (shapes.filter(shape => shape.name === shapeToCreate)) {
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
        }
        try {
            await subClient.create(subPayload)
            setShowSubForm(false)
            window.location.reload();
        } catch (e) {
            console.log(e)
            alert('cannot save the subscription' + e.response.request.responseText)
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
            console.log(e)
            alert('cannot save the function' + e.response.request.responseText)
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

    useEffect(() => {
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
                    ready: subscription.status.ready,
                    type: "subscription",
                };
                setSubscriptions(subscriptions => [...subscriptions, newSub])
            })
        };

        const getFunctions = async () => {
            setFunctions([])
            const functions = await funcClient.list()

            functions.data.map((func, i) => {
                let newFunc = {
                    id: func.name,
                    name: func.name,
                    namespace: func.namespace,
                    type: "function",
                };
                setFunctions(functions => [...functions, newFunc])
            })
        };

        const getLines = async () => {
            setLines([])
            const subs = await subClient.list()
            const funcs = await funcClient.list()
            subs.data.items.map((subscription) => {
                const connectedTo = funcClient.getFunctionNameBySink(subscription.spec.sink)
                if (connectedTo === null) {
                    return;
                }
                const newLine = {
                    props: {
                        start: subscription.metadata.name,
                        end: connectedTo,
                        root: subscription.metadata.name,
                    },
                }
                console.log(funcs.data)
                if (!funcs.data.find(func => func.name === connectedTo)) {
                    return;
                }
                setLines(lines => [...lines, newLine])
            })
        };
        getSubscriptions().then(() => console.log('Subscriptions\' list updated!'))
        getFunctions().then(() => console.log('Functions\' list updated!'))
        getLines().then(() => console.log('Connections were drawn'))
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
                                <Box {...boxProps} key={subscription.name} classes={`status-${subscription.ready}`} box={subscription}
                                     position="static" sidePos="left"/>
                            ))}
                        </div>
                        <div
                            className="function-container"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFunctionDrop}
                        >
                            <h4>Function Area</h4>
                            {functions.map((func) => (
                                <Box {...boxProps} key={func.id} className="sub-box" box={func} position="static"
                                     sidePos="left"/>
                            ))}
                        </div>
                    </div>
                    {lines.length}
                    {/* xarrow connections*/}
                    {lines.map((line, i) => (
                        subscriptions.length > 0 && functions.length > 0 && lines.length > 0 &&
                        <Xarrow
                            key={line.props.root + '-' + line.props.end + i}
                            line={line}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    ))}
                </div>
            </Xwrapper>
        </div>
    );
};
export default Editor;
