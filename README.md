# ket-node

A lightweight TypeScript utility for creating and configuring DOM elements with a declarative API.

`ket-node` helps you build HTML elements by describing their attributes, events, styles, datasets, ARIA attributes, classes, and children in a single object.

## Features

- ✅ Create elements with a single function
- ✅ Strong TypeScript typings
- ✅ Add classes, attributes, dataset and ARIA values
- ✅ Attach event listeners
- ✅ Apply inline styles (string or object)
- ✅ Append text and DOM children
- ✅ Optional initialization callback
- ✅ Zero dependencies

## Installation

```bash
npm install ket-node
```

## Basic Usage

```ts
import { elementByTagName } from "ket-node";

const button = elementByTagName("button", {
    classList: "primary",
    attribute: {
        type: "button"
    },
    children: "Click me"
});

document.body.append(button);
```

Produces:

```html
<button class="primary" type="button">Click me</button>
```

## API

### `elementByTagName(tagName, options?, onElement?)`

Creates a new HTML element using `document.createElement()`.

```ts
const div = elementByTagName("div");
```

### `elementByElement(element, options?, onElement?)`

Configures an existing element.

```ts
const input = document.createElement("input");

elementByElement(input, {
    attribute: {
        placeholder: "Your name"
    }
});
```

## Options

### classList

```ts
classList: "card"
```

or

```ts
classList: ["card", "shadow"]
```

### attribute

Sets DOM properties or HTML attributes.

```ts
attribute: {
    id: "login",
    type: "text",
    placeholder: "Username",
    disabled: false
}
```

### aria

Automatically prefixes keys with `aria-`.

```ts
aria: {
    label: "Close dialog",
    hidden: true
}
```

Produces:

```html
<button aria-label="Close dialog" aria-hidden="true"></button>
```

### dataset

Sets `data-*` attributes.

```ts
dataset: {
    id: 15,
    active: true
}
```

Produces:

```html
<div data-id="15" data-active></div>
```

### event

Attach event listeners.

```ts
event: {
    click(event) {
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
    fontSize: "18px",
    padding: "10px"
}
```

### children

Accepts:

- string
- HTMLElement
- Text
- arrays of the above

```ts
children: [
    "Hello ",
    elementByTagName("strong", {
        children: "World"
    })
]
```

## Initialization Callback

An optional callback is executed after the element has been configured.

```ts
elementByTagName(
    "button",
    {
        children: "Save"
    },
    button => {
        console.log(button);
    }
);
```

Async callbacks are also supported.

```ts
elementByTagName(
    "div",
    {},
    async element => {
        await loadData();
        element.textContent = "Loaded";
    }
);
```

Errors thrown inside async callbacks are automatically caught and logged.

## Complete Example

```ts
import { elementByTagName } from "ket-node";

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

## TypeScript

The library is fully typed.

Element types are inferred from the tag name.

```ts
const input = elementByTagName("input");

input.value = "Hello";
```

`input` is inferred as `HTMLInputElement`.

## License

Apache-2.0
