# ket-node

![NPM Version](https://img.shields.io/npm/v/%40mikhno351%2Fket-node)
![NPM Downloads](https://img.shields.io/npm/d18m/%40mikhno351%2Fket-node)
![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/%40mikhno351%2Fket-node)
![NPM License](https://img.shields.io/npm/l/%40mikhno351%2Fket-node) 


![Code simple](https://i.ibb.co/4ZkLyDXw/ket-node-simple-ts.png)

A lightweight TypeScript utility for creating and configuring DOM elements with a declarative API. Helps you build HTML elements by describing their attributes, events, styles, datasets, ARIA attributes, classes, and children in a single object.

## Features
- Create elements with a single function
- Strong TypeScript typings
- Add classes, attributes, dataset and ARIA values
- Attach event listeners
- Apply inline styles (string or object)
- Append text and DOM children
- Optional initialization callback
- Zero dependencies

## Usage

Use cdn:
```html
<script src="https://cdn.jsdelivr.net/npm/@mikhno351/ket-node/dist/index.js"></script>
```
Use npm:
```bash
npm i @mikhno351/ket-node
```

## API

### `elementByTagName(tagName, options?, onElement?)`

Creates a new HTML element using `document.createElement()`.
```ts
const input = elementByTagName("input");
```

### `elementByElement(element, options?, onElement?)`

Configures an existing element.
```ts
elementByElement(input, {
    attribute: {
        placeholder: "Enter your name..."
    }
});
```

## Options

### classList

```ts
classList: "card" // <element class="card">
```
or
```ts
classList: ["card", "shadow"] // <element class="card shadow">
```

### attribute

Sets DOM properties or HTML attributes.
```ts
attribute: {
    id: "login",
    type: "text",
    placeholder: "Enter your login...",
    disabled: false
}
// <element id="login" type="text" placeholder="Enter your login...">
```

### aria

Sets `aria-*` attributes.
```ts
aria: {
    label: "Close dialog",
    hidden: true
}
// <element aria-label="Close dialog" aria-hidden="true">
```

### dataset

Sets `data-*` attributes.
```ts
dataset: {
    id: 15,
    active: true
}
// <element data-id="15" data-active>
```

### event

Attach event listeners.
```ts
event: {
    click = event => {
        console.log(event.currentTarget);
    }
}
```

### style

Supports CSS text.
```ts
style: "color:red;font-size:18px;"
```
or an object.
```ts
style: {
    color: "red",
    fontSize: "18px"
}
```

### children

Accepts:
- string
- HTMLElement
- Text
- arrays of the above
```ts
children: ["Hello ", elementByTagName("strong", {
    children: "World"
})]
// <element>Hello <strong>World</strong></element>
```

## Initialization Callback

An optional callback is executed after the element has been configured.
```ts
elementByTagName("button", { children: "Save" }, button => {
    console.log(button); // <button>Save</button>
});
```

Async callbacks are also supported.
```ts
elementByTagName("div", {}, async element => {
    await loadData();
    element.textContent = "Loaded";
});
// Now: <div></div>
// Much later: <div>Loaded</div>
```
Errors thrown inside async callbacks are automatically caught and logged.

## Complete Example

```ts
import { elementByTagName } from "@mikhno351/ket-node";

const card = elementByTagName("div", {
    classList: ["card", "shadow"],

    attribute: {
        id: "profile"
    },

    dataset: {
        userId: 42
    },

    aria: {
        label: "User profile"
    },

    style: {
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px"
    },

    children: [
        elementByTagName("h2", {
            children: "John Doe"
        }),

        elementByTagName("button", {
            attribute: {
                type: "button"
            },

            event: {
                click() {
                    alert("Hello!");
                }
            },

            children: "Say hello"
        })
    ]
});

document.body.append(card);
```
Result:
```html
<div class="card shadow" id="profile" data-user-id="42" aria-label="User profile" style="padding:20px;border:1px solid #ddd;border-radius:8px">
    <h2>John Doe</h2>
    <button type="button">Say hello</button>
</div>
```
