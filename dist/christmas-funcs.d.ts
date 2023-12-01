/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
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
