import { Tensor2D, Tensor3D } from '../tensor';
import { TensorLike } from '../types';
declare function fromPixels_(pixels: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, numChannels?: number): Tensor3D;
export declare function toPixels(img: Tensor2D | Tensor3D | TensorLike, canvas?: HTMLCanvasElement): Promise<Uint8ClampedArray>;
export declare const fromPixels: typeof fromPixels_;
export {};
