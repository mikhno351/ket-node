type Element<T extends HTMLElement> = (element: T) => void | Promise<void>;
type ElementEvent<T extends HTMLElement> = {
    [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K] & {
        currentTarget: T;
    }) => void;
};
type ElementParam = Record<string, string | number | boolean>;
type ElementProperties<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type ElementAttribute<T extends HTMLElement> = Partial<Omit<T, ElementProperties<T> | "style">> & ElementParam;
type ElementStyle = string | Partial<Record<keyof CSSStyleDeclaration, string | number>>;
export type ElementChildren = HTMLElement | Text | string;
export interface ElementOptions<T extends HTMLElement = HTMLElement> {
    classList?: string | string[];
    attribute?: ElementAttribute<T>;
    aria?: ElementParam;
    dataset?: ElementParam;
    event?: ElementEvent<T>;
    style?: ElementStyle;
    children?: ElementChildren | ElementChildren[];
}
/**
 * @see elementByElement
 */
export declare function elementByTagName<T extends keyof HTMLElementTagNameMap>(tagName: T, options?: ElementOptions<HTMLElementTagNameMap[T]>, onElement?: Element<HTMLElementTagNameMap[T]>): HTMLElementTagNameMap[T];
export declare function elementByElement<T extends HTMLElement>(element: T, options?: ElementOptions<T>, onElement?: Element<T>): T;
export default ElementOptions;
//# sourceMappingURL=index.d.ts.map