export type tree = {
    label: string;
    stem: number[];
    branches: tree[] | null;
};
export declare const roomTree: tree;
