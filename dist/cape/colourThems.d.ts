export type Theme = {
    name: string;
    lower: number;
    upper: number;
};
export declare const themes: Theme[];
export declare const fade: (theme: Theme, propotion: number) => number;
export declare function colorwheel(pos: any): number;
