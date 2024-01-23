/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
export declare const snakes: {
    head: number;
    color: {
        r: number;
        g: number;
        b: number;
    };
}[];
export declare function colorwheel(pos: any): number;
export declare const fullStop: (controlObject: {
    controlInterval: NodeJS.Timeout | null;
}) => void;
export declare const rainbow: (controlObject: {
    controlInterval: NodeJS.Timeout | null;
}) => void;
export declare const mobiusStart: (controlObject: {
    controlInterval: NodeJS.Timeout | null;
}) => Promise<void>;
