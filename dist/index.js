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
function applyEachRecord(record, callback) {
    if (isObjectNonEmpty(record)) {
        Object.entries(record).forEach(([key, value]) => callback(key, value));
    }
}
function applyAttribute(element, key, value) {
    if (key in element && !isFunction(element[key])) {
        element[key] = value;
    }
    else if (isBoolean(value)) {
        element.toggleAttribute(key, value);
    }
    else {
        element.setAttribute(key, String(value));
    }
}
/**
 * @see elementByElement
 */
export function elementByTagName(tagName, options = {}, onElement) {
    return elementByElement(document.createElement(tagName), options, onElement);
}
export function elementByElement(element, options = {}, onElement) {
    if (!isUndefined(options.classList)) {
        element.classList.add(...toIterable(options.classList));
    }
    applyEachRecord(options.attribute, (name, value) => {
        applyAttribute(element, name, value);
    });
    applyEachRecord(options.aria, (key, value) => {
        applyAttribute(element, `aria-${key}`, String(value));
    });
    applyEachRecord(options.dataset, (key, value) => {
        if (isBoolean(value)) {
            value ? (element.dataset[key] = "") : delete element.dataset[key];
        }
        else {
            element.dataset[key] = String(value);
        }
    });
    applyEachRecord(options.event, (event, handler) => {
        if (isFunction(handler)) {
            element.addEventListener(event, handler);
        }
    });
    if (isStringNonEmpty(options.style)) {
        element.style.cssText = options.style;
    }
    else if (isObjectNonEmpty(options.style)) {
        Object.assign(element.style, options.style);
    }
    if (!isUndefined(options.children)) {
        const children = toIterable(options.children);
        if (isArrayNonEmpty(children)) {
            const fragment = document.createDocumentFragment();
            children.forEach(child => {
                if (isString(child)) {
                    fragment.append(document.createTextNode(child));
                }
                else if (isNode(child)) {
                    fragment.append(child);
                }
            });
            element.appendChild(fragment);
        }
    }
    if (!isUndefined(onElement)) {
        const result = onElement(element);
        if (isThenable(result)) {
            result.catch(error => console.error("Error in async onElement callback:", error));
        }
    }
    return element;
}
