function isArrayNonEmpty(value: unknown): value is unknown[] {
    return isArray(value) && value.length > 0;
}

function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

function isStringNonEmpty(value: unknown): value is string {
    return isString(value) && value.trim().length > 0;
}

function isString(value: unknown): value is string {
    return typeof value === "string";
}

function isNode(value: unknown): value is Node {
    return value instanceof Node;
}

function isObjectNonEmpty(value: unknown): value is Record<string, any>
{
    return isObject(value) && !isNull(value) && !isArray(value) && Object.keys(value).length > 0;
}

function isObject(value: unknown): value is object {
    return typeof value === "object";
}

function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

function isThenable<T = unknown>(value: unknown): value is Promise<T> {
    return isObject(value) && !isNull(value) && isFunction((value as any).then);
}

function isFunction(value: unknown): value is Function {
    return typeof value === "function";
}

function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}

function isNull(value: unknown): value is null {
    return value === null;
}

function toIterable<T>(value: T | T[]): T[] {
    return isArray(value) ? value : [value];
}

type Element<T extends HTMLElement> = (element: T) => void | Promise<void>;

type ElementEvent<T extends HTMLElement> = {
    [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K] & { currentTarget: T }) => void;
};

type ElementParam = Record<string, string | number | boolean>;

type ElementAttribute<T extends HTMLElement> = Partial<Omit<T, keyof HTMLElement | "style">> & ElementParam & {
    id?: string;
    className?: string;
    title?: string;
    lang?: string;
    dir?: string;
    hidden?: boolean;
    tabIndex?: number;
    accessKey?: string;
    draggable?: boolean;
    spellcheck?: boolean;
    contentEditable?: string | boolean;
    role?: string;
    action?: string;

    value?: string;
    defaultValue?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    placeholder?: string;
    name?: string;
    type?: string;
    checked?: boolean;
    multiple?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    size?: number;
    accept?: string;

    src?: string;
    href?: string;
    target?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    autocomplete?: string;
    autofocus?: boolean;
    selected?: boolean;
    rows?: number;
    cols?: number;
    wrap?: string;
};

type ElementStyle = string | Partial<Record<keyof CSSStyleDeclaration, string | number>>;

export type ElementChildren = HTMLElement | Text | string;

interface ElementOptions<T extends HTMLElement = HTMLElement> {
    classList?: string | string[];
    attribute?: ElementAttribute<T>;
    aria?: ElementParam;
    dataset?: ElementParam;
    event?: ElementEvent<T>;
    style?: ElementStyle;
    children?: ElementChildren | ElementChildren[];
}

function applyEachRecord<T>(record: Record<string, T> | undefined, callback: (key: string, value: T) => void): void {
    if (isObjectNonEmpty(record)) {
        Object.entries(record).forEach(([key, value]) => callback(key, value));
    }
}

function applyAttribute(element: HTMLElement, key: string, value: string | number | boolean): void {
    if (key in element && !isFunction((element as any)[key])) {
        (element as any)[key] = value;
    } else if (isBoolean(value)) {
        element.toggleAttribute(key, value);
    } else {
        element.setAttribute(key, String(value));
    }
}

/**
 * @see elementByElement
 */
export function elementByTagName<T extends keyof HTMLElementTagNameMap>(tagName: T, options: ElementOptions = {}, onElement?: Element<HTMLElementTagNameMap[T]>): HTMLElementTagNameMap[T] {
    return elementByElement(document.createElement(tagName), options, onElement);
}

export function elementByElement<T extends HTMLElement>(element: T, options: ElementOptions = {}, onElement?: Element<T>): T {
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
        } else {
            element.dataset[key] = String(value);
        }
    });

    applyEachRecord(options.event, (event, handler) => {
        if (isFunction(handler)) {
            element.addEventListener(event, handler as EventListenerOrEventListenerObject);
        }
    });

    if (isStringNonEmpty(options.style)) {
        element.style.cssText = options.style;
    } else if (isObjectNonEmpty(options.style)) {
        Object.assign(element.style, options.style);
    }

    if (!isUndefined(options.children)) {
        const children = toIterable(options.children);

        if (isArrayNonEmpty(children)) {
            const fragment = document.createDocumentFragment();

            children.forEach(child => {
                if (isString(child)) {
                    fragment.append(document.createTextNode(child));
                } else if (isNode(child)) {
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

export default ElementOptions;