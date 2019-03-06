export declare type GLSL = {
    version: string;
    attribute: string;
    varyingVs: string;
    varyingFs: string;
    texture2D: string;
    output: string;
    defineOutput: string;
    defineRound: string;
};
export declare function getGlslDifferences(): GLSL;
