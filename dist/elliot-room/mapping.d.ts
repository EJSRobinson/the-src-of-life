export type tree = {
    label: string;
    stem: number[];
    branches: tree[] | null;
};
export declare const roomTree: tree;
export declare const wave: (timestep: number, color: number) => Promise<void>;
