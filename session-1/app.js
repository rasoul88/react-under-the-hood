function createElement(type, props, ...children) {
    return {
        type,
        props: { ...props, children },
    };
}

function diff(oldNode, newNode) {
    // Case 1: New node is null or undefined (remove the old node)
    if (newNode === null || newNode === undefined) {
        return { type: "REMOVE" };
    }

    // Case 2: Node types are different (replace old node with new one)
    if (typeof oldNode !== typeof newNode || oldNode.type !== newNode.type) {
        return { type: "REPLACE", newNode };
    }

    // Case 3: Text nodes are different (update the text content)
    if (typeof oldNode === "string" || typeof oldNode === "number") {
        if (oldNode !== newNode) {
            return { type: "TEXT", newNode };
        }
    }

    // Case 4: Props or children differ (update them)
    const propPatches = diffProps(oldNode.props, newNode.props);
    const childPatches = diffChildren(
        oldNode.props?.children || [],
        newNode.props?.children || []
    );

    return { type: "UPDATE", propPatches, childPatches };
}

function diffProps(oldProps = {}, newProps = {}) {
    const patches = [];

    // Add or update props
    for (const key in newProps) {
        if (oldProps[key] !== newProps[key]) {
            patches.push({ type: "SET_PROP", key, value: newProps[key] });
        }
    }

    // Remove props
    for (const key in oldProps) {
        if (!(key in newProps)) {
            patches.push({ type: "REMOVE_PROP", key });
        }
    }

    return patches;
}

function diffChildren(oldChildren = [], newChildren = []) {
    const patches = [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
        patches.push(diff(oldChildren[i], newChildren[i]));
    }

    return patches;
}

function patch(domNode, patches, parentNode) {
    switch (patches.type) {
        case "REMOVE":
            parentNode.removeChild(domNode);
            break;

        case "REPLACE":
            const newDomNode = createRealDomNode(patches.newNode);
            if (!domNode) {
                //When we want to add a new element that did not exist before
                parentNode.appendChild(newDomNode)
            } else {
                parentNode.replaceChild(newDomNode, domNode);
            }
            break;

        case "TEXT":
            domNode.textContent = patches.newNode;
            break;

        case "UPDATE":
            applyPropPatches(domNode, patches.propPatches);
            patches.childPatches.forEach((childPatch, i) => {
                patch(domNode.childNodes[i], childPatch, domNode);
            });
            break;
    }
}

function applyPropPatches(domNode, propPatches) {
    propPatches.forEach((patch) => {
        if (patch.type === "SET_PROP") {
            if (patch.key.startsWith("on")) {
                const event = patch.key.toLowerCase();
                domNode[event] = patch.value
            } else {
                domNode[patch.key] = patch.value;
            }
        } else if (patch.type === "REMOVE_PROP") {
            domNode[patch.key] = null;
        }
    });
}

function createRealDomNode(vdom) {
    if (typeof vdom === "string" || typeof vdom === "number") {
        return document.createTextNode(vdom);
    }
    const domNode = document.createElement(vdom.type);
    if (vdom.props) {
        Object.keys(vdom.props).forEach((key) => {
            if (key.startsWith("on")) {
                const event = key.toLowerCase();
                domNode[event] = vdom.props[key]
            } else if (key !== "children") {
                domNode[key] = vdom.props[key];
            }
        });
        vdom.props.children.forEach((child) => {
            domNode.appendChild(createRealDomNode(child));
        });
    }
    return domNode;
}

let currentVDOM = null;

function render(vdom, container) {
    if (!currentVDOM) {
        // Initial render
        const domNode = createRealDomNode(vdom);
        container.appendChild(domNode);
    } else {
        // Diff and patch
        const patches = diff(currentVDOM, vdom);
        patch(container.firstChild, patches, container);
    }
    currentVDOM = vdom;
}

const vdom1 = createElement(
    "div",
    { id: "app" },
    createElement("h1", null, "Hello, Virtual DOM!"),
    createElement("p", null, "This is the first render")
);

const vdom2 = createElement(
    "div",
    { id: "app" },
    createElement("h1", null, "Hello, Updated DOM!"),
    createElement("p", null, "This is an updated render"),
    createElement("button", { onClick: () => alert("Clicked!") }, "Click Me")
);

const container = document.getElementById("root");
render(vdom1, container);

setTimeout(() => {
    render(vdom2, container);
}, 2000);

