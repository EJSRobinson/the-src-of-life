export type Theme = {
    name: string;
    colours: number[];
};
export declare const themes: Theme[];
export declare const fade: (theme: Theme, propotion: number) => number;
