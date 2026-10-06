type Children = string | number | boolean | Node | null | undefined;
export type ElementChildren = Children | Children[];
type ElementCallback<T extends Node> = (node: T) => void | Promise<void>;
type ElementEvent<T extends Element> = {
    [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K] & {
        currentTarget: T;
    }) => void;
};
type ElementClass = string | string[];
type ElementParamKey = string;
type ElementParamValue = string | number | boolean;
type ElementParam = Record<ElementParamKey, ElementParamValue>;
type ElementProperties<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
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
export declare const NAMESPACES: {
    readonly svg: "http://www.w3.org/2000/svg";
    readonly xhtml: "http://www.w3.org/1999/xhtml";
    readonly mathml: "http://www.w3.org/1998/Math/MathML";
    readonly xlink: "http://www.w3.org/1999/xlink";
    readonly xml: "http://www.w3.org/XML/1998/namespace";
};
export declare function nodeByText(text?: string | number): Text;
export declare function nodeByFragment(children?: ElementChildren): DocumentFragment;
/**
 * @see elementByElement
 */
export declare function elementByTagName<T extends keyof HTMLElementTagNameMap>(tagName: T, options?: ElementOptions<HTMLElementTagNameMap[T]>, onElement?: ElementCallback<HTMLElementTagNameMap[T]>): HTMLElementTagNameMap[T];
/**
 * @see elementByElement
 */
export declare function elementByTagNameNS<T extends keyof SVGElementTagNameMap = keyof SVGElementTagNameMap>(namespace: ElementNamespace, qualifiedName: T | string, options?: ElementOptions<SVGElementTagNameMap[T]>, onElement?: ElementCallback<SVGElementTagNameMap[T]>): SVGElementTagNameMap[T];
export declare function elementByElement<T extends Element>(element: T, options?: ElementOptions<T>, onElement?: ElementCallback<T>): T;
export default ElementOptions;
//# sourceMappingURL=index.d.ts.map