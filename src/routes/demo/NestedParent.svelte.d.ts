export default NestedParent;
type NestedParent = SvelteComponent<{
    childComponent?: typeof SvelteComponent | null | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> & {
    $$bindings?: string | undefined;
};
declare const NestedParent: $$__sveltets_2_IsomorphicComponent<{
    childComponent?: typeof SvelteComponent | null | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
import { SvelteComponent } from "svelte";
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import("svelte").ComponentConstructorOptions<Props>): import("svelte").SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
