/*
 * Copyright (c) 2026 Alexander Mikhno.
 * All rights reserved.
 * Project: ket-node
 */

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

function isNumber(value: unknown): value is number {
    return typeof value === "number";
}

function isNode(value: unknown): value is Node {
    return value instanceof Node;
}

function isObjectNonEmpty(value: unknown): value is Record<string, any> {
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

type Children = string | number | boolean | Node | null | undefined;

export type ElementChildren = Children | Children[];

type ElementCallback<T extends Node> = (node: T) => void | Promise<void>;

type ElementEvent<T extends Element> = {
    [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K] & { currentTarget: T }) => void;
};

type ElementClass = string | string[];

type ElementParamKey = string;

type ElementParamValue = string | number | boolean;

type ElementParam = Record<ElementParamKey, ElementParamValue>;

type ElementProperties<T> = { [K in keyof T]: T[K] extends Function ? K : never; }[keyof T];

export type ElementAttribute<T extends Element> = Partial<Omit<T, ElementProperties<T> | "style">> & ElementParam;

type ElementStyle = string | Partial<Record<keyof CSSStyleDeclaration, string | number>>;

export type ElementNamespace = keyof typeof NAMESPACES | (string & {});

export interface ElementOptions<T extends Element = Element> extends ElementCreationOptions {
    classList?: ElementClass;
    attribute?: ElementAttribute<T>;
    aria?: ElementParam;
    dataset?: ElementParam;
    event?: ElementEvent<T>;
    style?: ElementStyle;
    children?: ElementChildren;
}

export const NAMESPACES = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
} as const;

function applyEachRecord<T>(record: Record<ElementParamKey, T> | undefined, callback: (key: ElementParamKey, value: T) => void): void {
    if (isObjectNonEmpty(record)) {
        Object.entries(record).forEach(([key, value]) => callback(key, value));
    }
}

function applyAttribute(target: Element, key: ElementParamKey, value: ElementParamValue): void {
    if (key in target && !isFunction((target as any)[key])) {
        (target as any)[key] = value;
    } else if (isBoolean(value)) {
        target.toggleAttribute(key, value);
    } else {
        target.setAttribute(key, String(value));
    }
}

function applyClassList(target: Element, classList: ElementClass): void {
    if ("classList" in target) {
        target.classList.add(...toIterable(classList).flatMap(item => isStringNonEmpty(item) ? item.trim().split(/\s+/).filter(Boolean) : []));
    }
}

function applyChildren(target: Node, children: ElementChildren): void {
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
        } else if (isString(child) || isNumber(child)) {
            fragment.appendChild(nodeByText(child));
        }
    });

    target.appendChild(fragment);
}

export function nodeByText(text: string | number = ""): Text {
    return document.createTextNode(String(text));
}

export function nodeByFragment(children?: ElementChildren): DocumentFragment {
    const fragment = document.createDocumentFragment();
    if (children !== undefined) {
        applyChildren(fragment, children);
    }
    return fragment;
}

/**
 * @see elementByElement
 */
export function elementByTagName<T extends keyof HTMLElementTagNameMap>(tagName: T, options: ElementOptions<HTMLElementTagNameMap[T]> = {}, onElement?: ElementCallback<HTMLElementTagNameMap[T]>): HTMLElementTagNameMap[T] {
    return elementByElement(document.createElement(tagName, options), options, onElement);
}

/**
 * @see elementByElement
 */
export function elementByTagNameNS<T extends keyof SVGElementTagNameMap = keyof SVGElementTagNameMap>(namespace: ElementNamespace, qualifiedName: T | string, options: ElementOptions<SVGElementTagNameMap[T]> = {}, onElement?: ElementCallback<SVGElementTagNameMap[T]>): SVGElementTagNameMap[T] {
    return elementByElement(document.createElementNS(namespace in NAMESPACES ? NAMESPACES[namespace as keyof typeof NAMESPACES] : namespace, qualifiedName, options) as SVGElementTagNameMap[T], options, onElement);
}

export function elementByElement<T extends Element>(element: T, options: ElementOptions<T> = {}, onElement?: ElementCallback<T>): T {
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
            } else {
                element.dataset[key] = String(value);
            }
        });
    }

    applyEachRecord(options.event, (event, handler) => {
        if (isFunction(handler)) {
            element.addEventListener(event, handler as EventListenerOrEventListenerObject);
        }
    });

    if ("style" in element) {
        const htmlElement = element as unknown as HTMLElement;
        if (isStringNonEmpty(options.style)) {
            htmlElement.style.cssText = options.style;
        } else if (isObjectNonEmpty(options.style)) {
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

export default ElementOptions;