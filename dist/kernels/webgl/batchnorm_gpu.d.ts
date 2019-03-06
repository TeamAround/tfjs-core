import { GPGPUProgram } from './gpgpu_math';
export declare class BatchNormProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(xShape: number[], meanShape: number[], varianceShape: number[], offsetShape: number[] | null, scaleShape: number[] | null, varianceEpsilon: number);
}
