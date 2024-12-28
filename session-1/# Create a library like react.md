# How to create a library like React (but much simpler)

## 1. Introduction

Today, we’re going on a journey through the evolution of web development—starting from the days before frameworks, to understanding the building blocks of modern tools like React, and finally, learning how to create a simplified version of it ourselves.

Let’s take a moment to imagine what building websites was like in the early days:

- HTML for structure.
- CSS for styling.
- JavaScript for interactivity.

Back then, these tools worked, but they lacked cohesion. Developers often had to write complex, messy, and repetitive code just to manage simple updates to a webpage. Direct DOM manipulation was the norm, which was not only inefficient but also made debugging a nightmare as projects grew larger.

Then came frameworks and libraries like React, which revolutionized the way we think about building web applications. They introduced concepts like:

1.  The Declarative Paradigm: Shifting focus from how things happen to what we want to happen.
2.  The Virtual DOM: A way to efficiently manage changes to the UI.
3.  Reconciliation: A strategy to decide how the UI should update.

These ideas didn’t just solve problems—they transformed the way we think about and structure our code.

But here’s the exciting part: You don’t need to be a genius at Facebook to understand these principles. Today, we’re going to break them down step by step and see how they come together. By the end of this session, you’ll have the knowledge to create a simple library inspired by React, designed to tackle the same challenges but on a smaller scale.

Why does this matter?
Understanding how tools like React work under the hood demystifies them. It empowers you as a developer, enabling you to make better decisions, debug effectively, and even build custom tools tailored to your needs.

So, let’s dive in. We’ll start by exploring the struggles of web development before frameworks, understand the problems they aimed to solve, and gradually build up to our own miniature React-like library.

---

## 2. Before frameworks

Before frameworks like React, building interactive websites involved directly manipulating the DOM (Document Object Model) with JavaScript. While this approach worked, it quickly became cumbersome and error-prone as applications grew more complex.

Let’s look at a simple example: creating a counter that increments when a button is clicked.

Example: Counter Without Frameworks

Here’s how we might build it using plain JavaScript:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Create a library like React(but much simpler)</title>
  </head>
  <body>
    <h1>Counter: <span id="count">0</span></h1>
    <button id="increment">Increment</button>

    <script src="app.js"></script>
  </body>
</html>
```

```javascript
//app.js

const countElement = document.getElementById("count");
const button = document.getElementById("increment");
let count = 0;

const handleButtonClick = () => {
  count++; // Update the value
  countElement.textContent = count; // Update the DOM manually
};

button.onclick = handleButtonClick;
```

What’s Happening Here?

1. State Management:

- The count variable holds the state of the counter.

2. Event Handling:

- A click event listener is attached to the button.

3. DOM Manipulation:

- Every time the button is clicked, the DOM is updated manually by changing the textContent of the countElement.

### Challenges Without Frameworks

While this example is simple, imagine an application with dozens of counters or more complex UI interactions. Without frameworks, developers face several challenges:

1. Manual DOM Updates:
   - You have to manually locate and update elements, which is tedious and error-prone.
2. State Synchronization:
   - Keeping the UI in sync with the state becomes increasingly difficult as the application grows.
3. Code Maintenance <a href='#more-explanations__maintenance' style="color: #74ce91;">(\*1)</a>:
   - Direct DOM manipulation scatters logic across your code, making it hard to debug and maintain.
4. Performance Issues<a href='#more-explanations__performance' style="color: #74ce91;">(\*2)</a>:

   - Repeated DOM manipulation can degrade performance in larger applications.

---

## 3. Try to follow declarative paradigm

### 3.1 What is declarative paradigm:

The declarative paradigm is a programming paradigm where you describe what you want the program to achieve, rather than detailing how to achieve it. In simpler terms, you focus on the desired outcome or result and let the underlying system figure out the necessary steps to achieve it.

React follows the declarative paradigm for building UIs. Instead of specifying how the UI should change when the application state changes, you declare what the UI should look like based on the current state.

```javascript
function Greeting({ isLoggedIn }) {
  return (
    <div>{isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>}</div>
  );
}
```

### 3.2 implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Create a library like React(but much simpler)</title>
  </head>
  <body>
    <h1>Counter: <span id="count">0</span></h1>
    <button id="increment">Increment</button>

    <script src="app.js"></script>
  </body>
</html>
```

```javascript
//app.js

const countElement = document.getElementById("count");
const button = document.getElementById("increment");
let count = 0;

// it update DOM based on data(state)
const updateDom = () => {
  countElement.textContent = count;
};

const handleButtonClick = () => {
  count++; // Update the value
};

button.onclick = handleButtonClick;

setInterval(updateDom, 100);
```

### 3.3 problems

1. The _`updateDom`_ function works for this simple example, but we need a more generalized approach to efficiently convert data into UI.
2. Invoking _`updateDom`_ every 100ms is highly inefficient and unsustainable. We need a solution that updates the UI only when necessary.

## 4. VDOM

The Virtual DOM (VDOM) is a JavaScript representation of the real DOM. Instead of directly modifying the browser’s DOM, updates are made to the VDOM first, and then differences (or “diffs”) are applied to the real DOM.

### 4.1 create VDOM:

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: { ...props, children },
  };
}

function MyComponent(props) {
  return createElement(
    "div",
    null,
    createElement("h1", null, `Hello, ${props.name}`),
    createElement("p", null, "Welcome to our mini React library!")
  );
}

// Usage:
const vdom = MyComponent({ name: "Abolfazl" });
console.log(vdom);
```

```json
//output
{
  "type": "div",
  "props": {
    "children": [
      { "type": "h1", "props": { "children": ["Hello, Abolfazl"] } },
      {
        "type": "p",
        "props": { "children": ["Welcome to our mini React clone!"] }
      }
    ]
  }
}
```

- In practice, React uses JSX to invoke the createElement function:

```javascript
// Example: log a div element in a jsx file
import React from "react";

const App = () => {
  console.log(
    <div
      onClick={() => {
        console.log("hi there!");
      }}
    >
      <p>hello world</p>
    </div>
  );

  return <div />;
};

export default App;
```

```json
// output
{
  "$$typeof": "Symbol(react.element)",
  "key": null,
  "props": {
    "onClick": "()=>{ console.log('hi there!'); }",
    "children": {
      "$$typeof": "Symbol(react.element)",
      "key": null,
      "props": {
        "children": "hello world"
      },
      "ref": null,
      "type": "p",
      "_owner": "FiberNode {...}",
      "_store": {
        "validated": true
      },
      "_self": null,
      "_source": {
        "fileName": "/Users/snappshop/dev/customer/src/pages/index.tsx",
        "lineNumber": 33,
        "columnNumber": 7
      }
    }
  },
  "ref": null,
  "type": "div",
  "_owner": "FiberNode {...}",
  "_store": {
    "validated": false
  },
  "_self": null
}
```

### 4.2 Rendering the Virtual DOM:

Now that we can create Virtual DOM elements, let’s write a render function to convert them into real DOM elements.

```javascript
function render(vdom, container) {
  // Base case: Handle text nodes
  if (typeof vdom === "string" || typeof vdom === "number") {
    container.appendChild(document.createTextNode(vdom));
    return;
  }

  // Create the real DOM element
  const dom = document.createElement(vdom.type);

  if (vdom.props) {
    Object.keys(vdom.props).forEach((key) => {
      //add event listeners
      if (key.startsWith("on")) {
        const event = key.toLowerCase().substring(2); // e.g., "onClick" -> "click"
        dom.addEventListener(event, vdom.props[key]);
      } else if (key !== "children") {
        dom[key] = vdom.props[key];
      }
    });
  }

  // Recursively render children
  if (vdom.props.children) {
    vdom.props.children.forEach((child) => render(child, dom));
  }

  container.appendChild(dom);
}
```

### 4.3 Reconciliation

Reconciliation is the process of comparing the current Virtual DOM with the previous Virtual DOM to identify changes. Only the minimal set of changes (diffs) is applied to the real DOM.

#### I. Define a Diffing Algorithm

The diffing algorithm determines the differences between the old and new Virtual DOM trees. Let’s implement a simple version:

```javascript
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
```

This function recursively traverses both the old and new Virtual DOM trees to determine the changes.

#### II. Apply Patches

Once we have a set of patches (changes), we need to apply them to the real DOM. Let’s write a patching function:

```javascript
function patch(domNode, patches, parentNode) {
  switch (patches.type) {
    case "REMOVE":
      parentNode.removeChild(domNode);
      break;

    case "REPLACE":
      const newDomNode = createRealDomNode(patches.newNode);
      if (!domNode) {
        //When we want to add a new element that did not exist before
        parentNode.appendChild(newDomNode);
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
        domNode[event] = patch.value;
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
        domNode[event] = vdom.props[key];
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
```

#### III. Integrating Reconciliation with Rendering

We now integrate the diffing and patching process into our rendering function:

```javascript
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
```

```javascript
//Example

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
```

## 5. Add State Management

- Create a global storage to track the state of components. Use an index-based approach to track state values.

  ```javascript
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
  ```

- Modify the `render` function

  ```javascript
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
  ```

- Usage Example

  ```javascript
  function Counter() {
    const [count, setCount] = useState(0);

    const onClick = () => setCount(count + 1);

    return createElement(
      "div",
      null,
      createElement("h1", null, `Count: ${count}`),
      createElement("button", { onClick: onClick }, "Increment")
    );
  }

  const container = document.getElementById("root");
  render(Counter, container);
  ```

## 6. React Fiber Architecture

What is React Fiber?

**_React Fiber_** is the new **reconciliation engine** introduced in React 16. It is responsible for managing and optimizing the process of updating the user interface (UI) in response to changes in the application state or props.

Prior to React Fiber, React used a simpler algorithm for reconciliation, which had limitations in handling complex UI updates. React Fiber was introduced to overcome these limitations and enable more efficient updates with features like interruptible rendering and prioritized updates.

Key aspects of React Fiber include:

- Reconciliation: The process of comparing the previous and new virtual DOM to determine the minimal set of changes needed to update the actual DOM.

* Prioritized updates: React Fiber allows the prioritization of updates, ensuring that important updates (like user interactions) are processed before less urgent ones (like background tasks).

- Interruptible rendering: React Fiber enables rendering to be broken into smaller chunks, making it possible to pause and resume rendering, which helps keep the UI responsive.

In the next session, we will dive into React Fiber, exploring its architecture and how it enhances React’s rendering process. We’ll cover its role in improving the efficiency and performance of updates.

---

---

### 🎬 The End

---

---

# More explanations

<h3 id="more-explanations__maintenance"> *1: Why Direct DOM Manipulation hurts code maintenance</h3>

When using direct DOM manipulation, the logic to update and manage the UI often gets distributed throughout your codebase. Instead of having a single place to define how the UI should look based on data, updates happen in different parts of your code, tied to specific events or interactions. This lack of centralization makes the code harder to follow.

Example of Scattered Logic:

```javascript
// HTML
<div id="counter">0</div>
<button id="increment">Increment</button>

// JavaScript
const counterDiv = document.getElementById("counter");
const incrementButton = document.getElementById("increment");

let count = 0;

// Event listener to update counter
incrementButton.addEventListener("click", () => {
  count++;
  counterDiv.textContent = count; // Direct DOM manipulation
});

// Later, we add another piece of logic for resetting
const resetButton = document.createElement("button");
resetButton.textContent = "Reset";
document.body.appendChild(resetButton);

resetButton.addEventListener("click", () => {
  count = 0;
  counterDiv.textContent = count; // More direct DOM manipulation
});
```

- Debugging: When something goes wrong (e.g., the counter doesn’t update correctly), you need to hunt through all parts of the code that manipulate the counter element.
- Maintenance: Adding a new feature (like decrementing the counter) means you need to carefully add yet another event listener and ensure it doesn’t conflict with existing logic.

---

<h3 id="more-explanations__performance">*2: Why Repeated DOM Manipulation Can Cause Performance Issues:</h3>

Direct manipulation of the DOM in plain JavaScript can lead to performance problems, especially as the complexity of your application grows. Here’s why:

1. The DOM is Slow

   The DOM is an interface between JavaScript and the browser’s rendering engine. Every time you manipulate the DOM (e.g., updating an element, adding a new node, or changing styles), the browser must:

   - Update its internal representation of the DOM tree.
   - Recalculate the styles for the affected elements (CSS recalculation).
   - Repaint or reflow the page (depending on the changes).

   These processes, especially reflows (layout recalculations), are computationally expensive.

   Example: Frequent DOM Updates

   ```javascript
   const countElement = document.getElementById("count");
   for (let i = 0; i < 1000; i++) {
     countElement.textContent = i; // Updates the DOM 1000 times
   }
   ```

- Reflow: When the layout of the page is recalculated due to DOM changes, such as adding or removing elements, or changing their size or position.
- Repaint: When visual styles (like color or visibility) change without affecting the layout.

  Reflows are particularly expensive because they require recalculating the positions and dimensions of many elements. Changes to one element can cascade to its ancestors or children.

  Example: Cascading Reflows

  ```javascript
  const parent = document.getElementById("parent");
  for (let i = 0; i < 1000; i++) {
    const newChild = document.createElement("div");
    parent.appendChild(newChild); // Triggers a reflow every time
  }
  ```

  Here, each new child added to the DOM triggers a reflow because the layout of the parent and possibly other elements must be recalculated.

2. Inefficient DOM Updates

   When state changes, developers must manually ensure that the UI updates appropriately. This often involves querying the DOM repeatedly, leading to inefficiencies.

   Example:

   ```javascript
   const list = document.getElementById("list");
   for (let i = 0; i < 1000; i++) {
     const item = document.createElement("li");
     item.textContent = `Item ${i}`;
     list.appendChild(item); // Frequent DOM updates
   }
   ```

   Here, each addition to the list involves DOM interaction. A more efficient approach would batch these changes.

3. Lack of Batching or Optimization

   In plain JavaScript, developers must manually optimize DOM updates. Without frameworks or tools, each small change directly affects the DOM immediately, leading to redundant work.

How Frameworks Solve These Issues

Frameworks like React optimize performance by:

- Abstracting DOM Manipulation: Developers work declaratively, and the framework handles the actual DOM updates efficiently.
- Batching Updates: Multiple changes are grouped together and applied in one go.
- Minimizing Reflows: By comparing the Virtual DOM with the actual DOM, only the necessary updates are applied.

These optimizations are especially crucial for applications with frequent updates or complex UIs. By reducing direct DOM interactions, frameworks ensure better performance and scalability.

---

## Library Full Version

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Create a library like React(but much simpler)</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="app.js"></script>
  </body>
</html>
```

```javascript
//app.js
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
        parentNode.appendChild(newDomNode);
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
        domNode[event] = patch.value;
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
        domNode[event] = vdom.props[key];
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

  const onClick = () => setCount(count + 1);

  return createElement(
    "div",
    null,
    createElement("h1", null, `Count: ${count}`),
    createElement("button", { onClick: onClick }, "Increment")
  );
}

const container = document.getElementById("root");
render(Counter, container);
```
