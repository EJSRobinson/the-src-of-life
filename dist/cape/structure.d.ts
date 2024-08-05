export declare const deadPixels: number[];
type expandedSegment = {
    addrs: number[];
    positionX: number | null;
    side?: 'l' | 'r' | 'c';
    positionY?: number;
};
export declare const expandedMapping: expandedSegment[];
export declare const expandedMappingJoined: expandedSegment[];
export {};
