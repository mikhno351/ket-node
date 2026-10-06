/*
 * Copyright (c) 2026 Alexander Mikhno.
 * All rights reserved.
 * Project: ket-node
 */
function isArrayNonEmpty(value) {
    return isArray(value) && value.length > 0;
}
function isArray(value) {
    return Array.isArray(value);
}
function isStringNonEmpty(value) {
    return isString(value) && value.trim().length > 0;
}
function isString(value) {
    return typeof value === "string";
}
function isNumber(value) {
    return typeof value === "number";
}
function isNode(value) {
    return value instanceof Node;
}
function isObjectNonEmpty(value) {
    return isObject(value) && !isNull(value) && !isArray(value) && Object.keys(value).length > 0;
}
function isObject(value) {
    return typeof value === "object";
}
function isBoolean(value) {
    return typeof value === "boolean";
}
function isThenable(value) {
    return isObject(value) && !isNull(value) && isFunction(value.then);
}
function isFunction(value) {
    return typeof value === "function";
}
function isUndefined(value) {
    return value === undefined;
}
function isNull(value) {
    return value === null;
}
function toIterable(value) {
    return isArray(value) ? value : [value];
}
export const NAMESPACES = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
};
function applyEachRecord(record, callback) {
    if (isObjectNonEmpty(record)) {
        Object.entries(record).forEach(([key, value]) => callback(key, value));
    }
}
function applyAttribute(target, key, value) {
    if (key in target && !isFunction(target[key])) {
        target[key] = value;
    }
    else if (isBoolean(value)) {
        target.toggleAttribute(key, value);
    }
    else {
        target.setAttribute(key, String(value));
    }
}
function applyClassList(target, classList) {
    if ("classList" in target) {
        target.classList.add(...toIterable(classList).flatMap(item => isStringNonEmpty(item) ? item.trim().split(/\s+/).filter(Boolean) : []));
    }
}
function applyChildren(target, children) {
    if (isUndefined(children) || isNull(children)) {
        return;
    }
    const flatChildren = toIterable(children).flat(Infinity);
    if (!isArrayNonEmpty(flatChildren)) {
        return;
    }
    const fragment = nodeByFragment();
    flatChildren.forEach(child => {
        if (isNull(child) || isUndefined(child) || isBoolean(child)) {
            return;
        }
        if (isNode(child)) {
            fragment.appendChild(child);
        }
        else if (isString(child) || isNumber(child)) {
            fragment.appendChild(nodeByText(child));
        }
    });
    target.appendChild(fragment);
}
export function nodeByText(text = "") {
    return document.createTextNode(String(text));
}
export function nodeByFragment(children) {
    const fragment = document.createDocumentFragment();
    if (children !== undefined) {
        applyChildren(fragment, children);
    }
    return fragment;
}
/**
 * @see elementByElement
 */
export function elementByTagName(tagName, options = {}, onElement) {
    return elementByElement(document.createElement(tagName, options), options, onElement);
}
/**
 * @see elementByElement
 */
export function elementByTagNameNS(namespace, qualifiedName, options = {}, onElement) {
    return elementByElement(document.createElementNS(namespace in NAMESPACES ? NAMESPACES[namespace] : namespace, qualifiedName, options), options, onElement);
}
export function elementByElement(element, options = {}, onElement) {
    if (!isUndefined(options.classList)) {
        applyClassList(element, options.classList);
    }
    applyEachRecord(options.attribute, (name, value) => {
        applyAttribute(element, name, value);
    });
    applyEachRecord(options.aria, (key, value) => {
        applyAttribute(element, `aria-${key}`, String(value));
    });
    if (element instanceof HTMLElement && "dataset" in element) {
        applyEachRecord(options.dataset, (key, value) => {
            if (isBoolean(value)) {
                value ? (element.dataset[key] = "") : delete element.dataset[key];
            }
            else {
                element.dataset[key] = String(value);
            }
        });
    }
    applyEachRecord(options.event, (event, handler) => {
        if (isFunction(handler)) {
            element.addEventListener(event, handler);
        }
    });
    if ("style" in element) {
        const htmlElement = element;
        if (isStringNonEmpty(options.style)) {
            htmlElement.style.cssText = options.style;
        }
        else if (isObjectNonEmpty(options.style)) {
            Object.assign(htmlElement.style, options.style);
        }
    }
    if (!isUndefined(options.children)) {
        applyChildren(element, options.children);
    }
    if (!isUndefined(onElement)) {
        const result = onElement(element);
        if (isThenable(result)) {
            result.catch(error => console.error("Error in async onElement callback:", error));
        }
    }
    return element;
}
//# sourceMappingURL=index.js.map