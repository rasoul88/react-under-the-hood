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

function render(component, container) {
    currentComponent = component;
    hookIndex = 0; // Reset the hook index before rendering

    const vdom = component();


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

let currentVDOM = null;
let currentComponent = null; // Tracks the currently rendering component
let hookIndex = 0; // Tracks the index of the current hook
const stateStorage = new Map(); // Map to hold state for components

function useState(initialValue) {
    // Get or initialize hooks for the current component
    const hooks = stateStorage.get(currentComponent) || [];

    // Initialize the state if it doesn't exist
    if (hookIndex >= hooks.length) {
        hooks.push(initialValue);
    }


    const stateValue = hooks[hookIndex]; // Get the current state value

    // Function to update state and trigger re-render
    const setState = (newValue) => {
        hooks[hookIndex] = newValue; // Update the state value
        stateStorage.set(currentComponent, hooks); // Save updated hooks

        // Trigger re-render of the current component
        render(currentComponent, container);
    };

    stateStorage.set(currentComponent, hooks); // Save hooks back into the storage
    return [stateValue, setState];
}


function Counter() {
    const [count, setCount] = useState(0);

    const onClick = () => setCount(count + 1)

    return createElement(
        "div",
        null,
        createElement("h1", null, `Count: ${count}`),
        createElement(
            "button",
            { onClick: onClick },
            "Increment"
        )
    );
}

const container = document.getElementById("root");
render(Counter, container);