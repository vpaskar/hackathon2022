import React from "react";
import './about.css';


function About() {
    return (
        <div className="Welcome">
            <header className="Welcome-header">
                About Page
            </header>
            <body>
            <div className="welcome-info">Here is an info about our app and us!</div>
            Hi there! We are the skydivers. We do a lot of backend work, have 0 (that's "Z E R O") talent for frontend development, and therefore decided to build a frontend doohickey for messing around with the Kubernetes stuff.

            The basis of our hacky little project is Kyma, SAP's battery-included turn on Kubernetes. Kyma's build-in eventing system is cool: An app can subscribe to certain events and whenever such events occur --inside or outside of the cluster-- the app will receive these events.
            Another cool part about Kyma is Busola, the web-based UI that allows you to deal with all of Kyma's toys without using scary things like command line tools. For example, you can create event subscriptions and connect them to functions. We wondered: Could we streamline this UI even further? Could we create a nice nocode/lowcode webapp that allows you --in one place-- to create functions and subscriptions, connect them via drag and drop, send events against the subscription, and read the event logs? Like an eventing playground? With nice colours and beautiful fonts?
            We made our own dream come true.
            </body>
        </div>
    );
}

export default About;
