type Element<T extends HTMLElement> = (element: T) => void | Promise<void>;
type ElementEvent<T extends HTMLElement> = {
    [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K] & {
        currentTarget: T;
    }) => void;
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
/**
 * @see elementByElement
 */
export declare function elementByTagName<T extends keyof HTMLElementTagNameMap>(tagName: T, options?: ElementOptions, onElement?: Element<HTMLElementTagNameMap[T]>): HTMLElementTagNameMap[T];
export declare function elementByElement<T extends HTMLElement>(element: T, options?: ElementOptions, onElement?: Element<T>): T;
export default ElementOptions;
//# sourceMappingURL=index.d.ts.map