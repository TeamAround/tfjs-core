"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("../index");
var jasmine_util_1 = require("../jasmine_util");
var test_util_1 = require("../test_util");
jasmine_util_1.describeWithFlags('batchnorm packed', test_util_1.PACKED_ENVS, function () {
    it('should not leak memory', function () {
        var x = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
        var mean = tf.tensor1d([1, 2]);
        var variance = tf.tensor1d([2, 3]);
        var varianceEpsilon = .001;
        var startNumBytes = tf.memory().numBytes;
        var startNumTensors = tf.memory().numTensors;
        tf.batchNorm4d(x, mean, variance, undefined, undefined, varianceEpsilon);
        var endNumBytes = tf.memory().numBytes;
        var endNumTensors = tf.memory().numTensors;
        expect(endNumBytes - startNumBytes).toEqual(16);
        expect(endNumTensors - startNumTensors).toEqual(1);
    });
});
jasmine_util_1.describeWithFlags('batchNorm', test_util_1.WEBGL_ENVS, function () {
    it('should work for broadcasted inputs', function () {
        var x = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
        var mean = tf.tensor4d([1], [1, 1, 1, 1]);
        var variance = tf.tensor4d([1], [1, 1, 1, 1]);
        var result = tf.batchNorm4d(x, mean, variance);
        test_util_1.expectArraysClose(result, [0.9995003, 2.9985011, 7.9960027, 21.9890079]);
    });
    it('should work when squarification results in zero padding', function () {
        var maxTextureSize = tf.ENV.get('WEBGL_MAX_TEXTURE_SIZE');
        tf.ENV.set('WEBGL_MAX_TEXTURE_SIZE', 5);
        var x = tf.tensor3d([
            0.49955603, 0.04158615, -1.09440524, 2.03854165, -0.61578344,
            2.87533573, 1.18105987, 0.807462, 1.87888837, 2.26563962, -0.37040935,
            1.35848753, -0.75347094, 0.15683117, 0.91925946, 0.34121279,
            0.92717143, 1.89683965
        ], [2, 3, 3]);
        var mean = tf.tensor1d([0.39745062, -0.48062894, 0.4847822]);
        var variance = tf.tensor1d([0.32375343, 0.67117643, 1.08334653]);
        var offset = tf.tensor1d([0.69398749, -1.29056387, 0.9429723]);
        var scale = tf.tensor1d([-0.5607271, 0.9878457, 0.25181573]);
        var varianceEpsilon = .001;
        var result = tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon);
        tf.ENV.set('WEBGL_MAX_TEXTURE_SIZE', maxTextureSize);
        test_util_1.expectArraysClose(result, [
            0.59352049, -0.66135202, 0.5610874, -0.92077015, -1.45341019, 1.52106473,
            -0.07704776, 0.26144429, 1.28010017, -1.14422404, -1.15776136, 1.15425493,
            1.82644104, -0.52249442, 1.04803919, 0.74932291, 0.40568101, 1.2844412
        ]);
    });
});
jasmine_util_1.describeWithFlags('batchNormalization4D', test_util_1.ALL_ENVS, function () {
    it('simple batchnorm4D, no offset or scale, 2x1x1x2', function () { return __awaiter(_this, void 0, void 0, function () {
        var xT, meanT, varianceT, varianceEpsilon, result, x, mean, variance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xT = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
                    meanT = tf.tensor1d([1, 2]);
                    varianceT = tf.tensor1d([2, 3]);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization4d(xT, meanT, varianceT, varianceEpsilon, undefined, undefined);
                    return [4, xT.array()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.array()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.array()];
                case 3:
                    variance = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        (x[0][0][0][0] - mean[0]) * 1 / Math.sqrt(variance[0] + varianceEpsilon),
                        (x[0][0][0][1] - mean[1]) * 1 / Math.sqrt(variance[1] + varianceEpsilon),
                        (x[1][0][0][0] - mean[0]) * 1 / Math.sqrt(variance[0] + varianceEpsilon),
                        (x[1][0][0][1] - mean[1]) * 1 / Math.sqrt(variance[1] + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('simple batchnorm4D, no offset, 2x1x1x2', function () { return __awaiter(_this, void 0, void 0, function () {
        var xT, meanT, varianceT, scaleT, varianceEpsilon, result, x, mean, variance, scale;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xT = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
                    meanT = tf.tensor1d([1, 2]);
                    varianceT = tf.tensor1d([2, 3]);
                    scaleT = tf.tensor1d([4, 5]);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization4d(xT, meanT, varianceT, varianceEpsilon, scaleT, undefined);
                    return [4, xT.buffer()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.buffer()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.buffer()];
                case 3:
                    variance = _a.sent();
                    return [4, scaleT.buffer()];
                case 4:
                    scale = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        (x.get(0, 0, 0, 0) - mean.get(0)) * scale.get(0) /
                            Math.sqrt(variance.get(0) + varianceEpsilon),
                        (x.get(0, 0, 0, 1) - mean.get(1)) * scale.get(1) /
                            Math.sqrt(variance.get(1) + varianceEpsilon),
                        (x.get(1, 0, 0, 0) - mean.get(0)) * scale.get(0) /
                            Math.sqrt(variance.get(0) + varianceEpsilon),
                        (x.get(1, 0, 0, 1) - mean.get(1)) * scale.get(1) /
                            Math.sqrt(variance.get(1) + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('simple batchnorm4D, no scale, 2x1x1x2', function () { return __awaiter(_this, void 0, void 0, function () {
        var xT, meanT, varianceT, offsetT, varianceEpsilon, result, x, mean, variance, offset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xT = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
                    meanT = tf.tensor1d([1, 2]);
                    varianceT = tf.tensor1d([2, 3]);
                    offsetT = tf.tensor1d([4, 5]);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization4d(xT, meanT, varianceT, varianceEpsilon, undefined, offsetT);
                    return [4, xT.buffer()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.buffer()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.buffer()];
                case 3:
                    variance = _a.sent();
                    return [4, offsetT.buffer()];
                case 4:
                    offset = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        offset.get(0) +
                            (x.get(0, 0, 0, 0) - mean.get(0)) * 1 /
                                Math.sqrt(variance.get(0) + varianceEpsilon),
                        offset.get(1) +
                            (x.get(0, 0, 0, 1) - mean.get(1)) * 1 /
                                Math.sqrt(variance.get(1) + varianceEpsilon),
                        offset.get(0) +
                            (x.get(1, 0, 0, 0) - mean.get(0)) * 1 /
                                Math.sqrt(variance.get(0) + varianceEpsilon),
                        offset.get(1) +
                            (x.get(1, 0, 0, 1) - mean.get(1)) * 1 /
                                Math.sqrt(variance.get(1) + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('simple batchnorm4D, 2x1x1x2', function () { return __awaiter(_this, void 0, void 0, function () {
        var xT, meanT, varianceT, offsetT, scaleT, varianceEpsilon, result, x, mean, variance, scale, offset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xT = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
                    meanT = tf.tensor1d([1, 2]);
                    varianceT = tf.tensor1d([2, 3]);
                    offsetT = tf.tensor1d([3, 4]);
                    scaleT = tf.tensor1d([4, 5]);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization4d(xT, meanT, varianceT, varianceEpsilon, scaleT, offsetT);
                    return [4, xT.buffer()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.buffer()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.buffer()];
                case 3:
                    variance = _a.sent();
                    return [4, scaleT.buffer()];
                case 4:
                    scale = _a.sent();
                    return [4, offsetT.buffer()];
                case 5:
                    offset = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        offset.get(0) +
                            (x.get(0, 0, 0, 0) - mean.get(0)) * scale.get(0) /
                                Math.sqrt(variance.get(0) + varianceEpsilon),
                        offset.get(1) +
                            (x.get(0, 0, 0, 1) - mean.get(1)) * scale.get(1) /
                                Math.sqrt(variance.get(1) + varianceEpsilon),
                        offset.get(0) +
                            (x.get(1, 0, 0, 0) - mean.get(0)) * scale.get(0) /
                                Math.sqrt(variance.get(0) + varianceEpsilon),
                        offset.get(1) +
                            (x.get(1, 0, 0, 1) - mean.get(1)) * scale.get(1) /
                                Math.sqrt(variance.get(1) + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('accepts a tensor-like object', function () {
        var x = [[[[2, 4]]], [[[9, 23]]]];
        var mean = [1, 2];
        var variance = [2, 3];
        var offset = [3, 4];
        var scale = [4, 5];
        var varianceEpsilon = .001;
        var result = tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon);
        test_util_1.expectArraysClose(result, [
            offset[0] +
                (x[0][0][0][0] - mean[0]) * scale[0] /
                    Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[0][0][0][1] - mean[1]) * scale[1] /
                    Math.sqrt(variance[1] + varianceEpsilon),
            offset[0] +
                (x[1][0][0][0] - mean[0]) * scale[0] /
                    Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[1][0][0][1] - mean[1]) * scale[1] /
                    Math.sqrt(variance[1] + varianceEpsilon)
        ]);
    });
    it('simple batchnorm4D gradients, 2x1x1x2', function () {
        var x = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
        var mean = tf.tensor1d([1, 2]);
        var variance = tf.tensor1d([2, 3]);
        var offset = tf.tensor1d([3, 4]);
        var scale = tf.tensor1d([2, 5]);
        var varianceEpsilon = .001;
        var dy = tf.tensor4d([-1, -1, -1, -1], [2, 1, 1, 2]);
        var gradX = tf.grad(function (x) { return tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon); })(x, dy);
        test_util_1.expectArraysClose(gradX, tf.tensor4d([-1.414, -2.887, -1.414, -2.887], [2, 1, 1, 2]));
        var gradMean = tf.grad(function (mean) { return tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon); })(mean, dy);
        test_util_1.expectArraysClose(gradMean, tf.tensor1d([2.828, 5.773]));
        var gradVariance = tf.grad(function (variance) { return tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon); })(variance, dy);
        test_util_1.expectArraysClose(gradVariance, tf.tensor1d([3.180, 11.060]));
        var gradOffset = tf.grad(function (offset) { return tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon); })(offset, dy);
        test_util_1.expectArraysClose(gradOffset, dy.sum([0, 1, 2]));
        var gradScale = tf.grad(function (scale) { return tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon); })(scale, dy);
        test_util_1.expectArraysClose(gradScale, tf.tensor1d([-6.362, -13.277]));
    });
    it('batchnorm4D gradients, same shapes in x, mean and variance', function () {
        var x = tf.tensor4d([10, 20, 30, 40], [2, 1, 1, 2]);
        var mean = tf.tensor4d([0, 5, 10, 15], [2, 1, 1, 2]);
        var variance = tf.tensor4d([2, 4, 6, 8], [2, 1, 1, 2]);
        var scale = tf.tensor4d([2, 5, 2, 5], [2, 1, 1, 2]);
        var offset = tf.tensor4d([0, 0, 0, 0], [2, 1, 1, 2]);
        var varianceEpsilon = .001;
        var dy = tf.tensor4d([-1, -1, -1, -1], [2, 1, 1, 2]);
        var gradX = tf.grad(function (x) { return tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon); })(x, dy);
        test_util_1.expectArraysClose(gradX, tf.tensor4d([-1.414, -2.500, -0.816, -1.768], [2, 1, 1, 2]));
        var gradMean = tf.grad(function (mean) { return tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon); })(mean, dy);
        test_util_1.expectArraysClose(gradMean, tf.tensor4d([1.414, 2.500, 0.816, 1.768], [2, 1, 1, 2]));
        var gradVariance = tf.grad(function (variance) { return tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon); })(variance, dy);
        test_util_1.expectArraysClose(gradVariance, tf.tensor4d([3.533, 4.686, 1.360, 2.762], [2, 1, 1, 2]));
        var gradOffset = tf.grad(function (offset) { return tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon); })(offset, dy);
        test_util_1.expectArraysClose(gradOffset, dy);
        var gradScale = tf.grad(function (scale) { return tf.batchNorm4d(x, mean, variance, offset, scale, varianceEpsilon); })(scale, dy);
        test_util_1.expectArraysClose(gradScale, tf.tensor4d([-7.069, -7.499, -8.164, -8.838], [2, 1, 1, 2]));
    });
});
jasmine_util_1.describeWithFlags('batchNormalization3D', test_util_1.ALL_ENVS, function () {
    it('simple batchnorm3D, no offset or scale, 2x1x2', function () { return __awaiter(_this, void 0, void 0, function () {
        var xT, meanT, varianceT, varianceEpsilon, result, x, mean, variance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xT = tf.tensor3d([2, 4, 9, 23], [2, 1, 2]);
                    meanT = tf.tensor1d([1, 2]);
                    varianceT = tf.tensor1d([2, 3]);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization3d(xT, meanT, varianceT, varianceEpsilon, undefined, undefined);
                    return [4, xT.buffer()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.buffer()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.buffer()];
                case 3:
                    variance = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        (x.get(0, 0, 0) - mean.get(0)) * 1 /
                            Math.sqrt(variance.get(0) + varianceEpsilon),
                        (x.get(0, 0, 1) - mean.get(1)) * 1 /
                            Math.sqrt(variance.get(1) + varianceEpsilon),
                        (x.get(1, 0, 0) - mean.get(0)) * 1 /
                            Math.sqrt(variance.get(0) + varianceEpsilon),
                        (x.get(1, 0, 1) - mean.get(1)) * 1 /
                            Math.sqrt(variance.get(1) + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('simple batchnorm3D, no offset, 2x1x2', function () { return __awaiter(_this, void 0, void 0, function () {
        var xT, meanT, varianceT, scaleT, varianceEpsilon, result, x, mean, variance, scale;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xT = tf.tensor3d([2, 4, 9, 23], [2, 1, 2]);
                    meanT = tf.tensor1d([1, 2]);
                    varianceT = tf.tensor1d([2, 3]);
                    scaleT = tf.tensor1d([4, 5]);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization3d(xT, meanT, varianceT, varianceEpsilon, scaleT, undefined);
                    return [4, xT.buffer()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.buffer()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.buffer()];
                case 3:
                    variance = _a.sent();
                    return [4, scaleT.buffer()];
                case 4:
                    scale = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        (x.get(0, 0, 0) - mean.get(0)) * scale.get(0) /
                            Math.sqrt(variance.get(0) + varianceEpsilon),
                        (x.get(0, 0, 1) - mean.get(1)) * scale.get(1) /
                            Math.sqrt(variance.get(1) + varianceEpsilon),
                        (x.get(1, 0, 0) - mean.get(0)) * scale.get(0) /
                            Math.sqrt(variance.get(0) + varianceEpsilon),
                        (x.get(1, 0, 1) - mean.get(1)) * scale.get(1) /
                            Math.sqrt(variance.get(1) + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('simple batchnorm3D, no scale, 2x1x2', function () { return __awaiter(_this, void 0, void 0, function () {
        var xT, meanT, varianceT, offsetT, varianceEpsilon, result, x, mean, variance, offset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xT = tf.tensor3d([2, 4, 9, 23], [2, 1, 2]);
                    meanT = tf.tensor1d([1, 2]);
                    varianceT = tf.tensor1d([2, 3]);
                    offsetT = tf.tensor1d([4, 5]);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization3d(xT, meanT, varianceT, varianceEpsilon, undefined, offsetT);
                    return [4, xT.buffer()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.buffer()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.buffer()];
                case 3:
                    variance = _a.sent();
                    return [4, offsetT.buffer()];
                case 4:
                    offset = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        offset.get(0) +
                            (x.get(0, 0, 0) - mean.get(0)) * 1 /
                                Math.sqrt(variance.get(0) + varianceEpsilon),
                        offset.get(1) +
                            (x.get(0, 0, 1) - mean.get(1)) * 1 /
                                Math.sqrt(variance.get(1) + varianceEpsilon),
                        offset.get(0) +
                            (x.get(1, 0, 0) - mean.get(0)) * 1 /
                                Math.sqrt(variance.get(0) + varianceEpsilon),
                        offset.get(1) +
                            (x.get(1, 0, 1) - mean.get(1)) * 1 /
                                Math.sqrt(variance.get(1) + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('simple batchnorm3D, 2x1x2', function () { return __awaiter(_this, void 0, void 0, function () {
        var xT, meanT, varianceT, offsetT, scaleT, varianceEpsilon, result, x, mean, variance, offset, scale;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xT = tf.tensor3d([2, 4, 9, 23], [2, 1, 2]);
                    meanT = tf.tensor1d([1, 2]);
                    varianceT = tf.tensor1d([2, 3]);
                    offsetT = tf.tensor1d([3, 4]);
                    scaleT = tf.tensor1d([4, 5]);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization3d(xT, meanT, varianceT, varianceEpsilon, scaleT, offsetT);
                    return [4, xT.buffer()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.buffer()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.buffer()];
                case 3:
                    variance = _a.sent();
                    return [4, offsetT.buffer()];
                case 4:
                    offset = _a.sent();
                    return [4, scaleT.buffer()];
                case 5:
                    scale = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        offset.get(0) +
                            (x.get(0, 0, 0) - mean.get(0)) * scale.get(0) /
                                Math.sqrt(variance.get(0) + varianceEpsilon),
                        offset.get(1) +
                            (x.get(0, 0, 1) - mean.get(1)) * scale.get(1) /
                                Math.sqrt(variance.get(1) + varianceEpsilon),
                        offset.get(0) +
                            (x.get(1, 0, 0) - mean.get(0)) * scale.get(0) /
                                Math.sqrt(variance.get(0) + varianceEpsilon),
                        offset.get(1) +
                            (x.get(1, 0, 1) - mean.get(1)) * scale.get(1) /
                                Math.sqrt(variance.get(1) + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('accepts a tensor-like object', function () {
        var x = [[[2, 4]], [[9, 23]]];
        var mean = [1, 2];
        var variance = [2, 3];
        var offset = [3, 4];
        var scale = [4, 5];
        var varianceEpsilon = .001;
        var result = tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon);
        test_util_1.expectArraysClose(result, [
            offset[0] +
                (x[0][0][0] - mean[0]) * scale[0] /
                    Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[0][0][1] - mean[1]) * scale[1] /
                    Math.sqrt(variance[1] + varianceEpsilon),
            offset[0] +
                (x[1][0][0] - mean[0]) * scale[0] /
                    Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[1][0][1] - mean[1]) * scale[1] /
                    Math.sqrt(variance[1] + varianceEpsilon)
        ]);
    });
    it('batchnorm3D, x,mean,var,offset,scale are all 3D', function () { return __awaiter(_this, void 0, void 0, function () {
        var shape, xT, meanT, varianceT, offsetT, scaleT, varianceEpsilon, result, x, mean, variance, offset, scale;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shape = [2, 1, 2];
                    xT = tf.tensor3d([2, 4, 9, 23], shape);
                    meanT = tf.tensor3d([1, 2, 3, 4], shape);
                    varianceT = tf.tensor3d([2, 3, 4, 5], shape);
                    offsetT = tf.tensor3d([3, 4, 5, 6], shape);
                    scaleT = tf.tensor3d([4, 5, 6, 7], shape);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization3d(xT, meanT, varianceT, varianceEpsilon, scaleT, offsetT);
                    return [4, xT.buffer()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.buffer()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.buffer()];
                case 3:
                    variance = _a.sent();
                    return [4, offsetT.buffer()];
                case 4:
                    offset = _a.sent();
                    return [4, scaleT.buffer()];
                case 5:
                    scale = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        offset.get(0, 0, 0) +
                            (x.get(0, 0, 0) - mean.get(0, 0, 0)) * scale.get(0, 0, 0) /
                                Math.sqrt(variance.get(0, 0, 0) + varianceEpsilon),
                        offset.get(0, 0, 1) +
                            (x.get(0, 0, 1) - mean.get(0, 0, 1)) * scale.get(0, 0, 1) /
                                Math.sqrt(variance.get(0, 0, 1) + varianceEpsilon),
                        offset.get(1, 0, 0) +
                            (x.get(1, 0, 0) - mean.get(1, 0, 0)) * scale.get(1, 0, 0) /
                                Math.sqrt(variance.get(1, 0, 0) + varianceEpsilon),
                        offset.get(1, 0, 1) +
                            (x.get(1, 0, 1) - mean.get(1, 0, 1)) * scale.get(1, 0, 1) /
                                Math.sqrt(variance.get(1, 0, 1) + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('simple batchnorm3D gradients, 2x1x2', function () {
        var x = tf.tensor3d([2, 4, 9, 23], [2, 1, 2]);
        var mean = tf.tensor1d([1, 2]);
        var variance = tf.tensor1d([2, 3]);
        var offset = tf.tensor1d([3, 4]);
        var scale = tf.tensor1d([2, 5]);
        var varianceEpsilon = .001;
        var dy = tf.tensor3d([1, 1, 1, 1], [2, 1, 2]);
        var gradX = tf.grad(function (x) { return tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon); })(x, dy);
        test_util_1.expectArraysClose(gradX, tf.tensor3d([1.414, 2.887, 1.414, 2.887], [2, 1, 2]));
        var gradMean = tf.grad(function (mean) { return tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon); })(mean, dy);
        test_util_1.expectArraysClose(gradMean, tf.tensor1d([-2.828, -5.773]));
        var gradVariance = tf.grad(function (variance) { return tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon); })(variance, dy);
        test_util_1.expectArraysClose(gradVariance, tf.tensor1d([-3.180, -11.060]));
        var gradOffset = tf.grad(function (offset) { return tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon); })(offset, dy);
        test_util_1.expectArraysClose(gradOffset, tf.onesLike(offset).mul(tf.scalar(2)));
        var gradScale = tf.grad(function (scale) { return tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon); })(scale, dy);
        test_util_1.expectArraysClose(gradScale, tf.tensor1d([6.362, 13.277]));
    });
    it('batchnorm3D gradients, same shapes in x, mean and variance', function () {
        var x = tf.tensor3d([10, 20, 30, 40], [2, 1, 2]);
        var mean = tf.tensor3d([0, 5, 10, 15], [2, 1, 2]);
        var variance = tf.tensor3d([2, 4, 6, 8], [2, 1, 2]);
        var scale = tf.tensor3d([2, 5, 2, 5], [2, 1, 2]);
        var offset = tf.tensor3d([0, 0, 0, 0], [2, 1, 2]);
        var varianceEpsilon = .001;
        var dy = tf.tensor3d([1, 1, 1, 1], [2, 1, 2]);
        var gradX = tf.grad(function (x) { return tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon); })(x, dy);
        test_util_1.expectArraysClose(gradX, tf.tensor3d([1.414, 2.500, 0.816, 1.768], [2, 1, 2]));
        var gradMean = tf.grad(function (mean) { return tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon); })(mean, dy);
        test_util_1.expectArraysClose(gradMean, tf.tensor3d([-1.414, -2.500, -0.816, -1.768], [2, 1, 2]));
        var gradVariance = tf.grad(function (variance) { return tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon); })(variance, dy);
        test_util_1.expectArraysClose(gradVariance, tf.tensor3d([-3.533, -4.686, -1.360, -2.762], [2, 1, 2]));
        var gradOffset = tf.grad(function (offset) { return tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon); })(offset, dy);
        test_util_1.expectArraysClose(gradOffset, tf.onesLike(offset));
        var gradScale = tf.grad(function (scale) { return tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon); })(scale, dy);
        test_util_1.expectArraysClose(gradScale, tf.tensor3d([7.069, 7.499, 8.164, 8.838], [2, 1, 2]));
    });
    it('batchnorm matches tensorflow, 2x3x3', function () {
        var x = tf.tensor3d([
            0.49955603, 0.04158615, -1.09440524, 2.03854165, -0.61578344,
            2.87533573, 1.18105987, 0.807462, 1.87888837, 2.26563962, -0.37040935,
            1.35848753, -0.75347094, 0.15683117, 0.91925946, 0.34121279,
            0.92717143, 1.89683965
        ], [2, 3, 3]);
        var mean = tf.tensor1d([0.39745062, -0.48062894, 0.4847822]);
        var variance = tf.tensor1d([0.32375343, 0.67117643, 1.08334653]);
        var offset = tf.tensor1d([0.69398749, -1.29056387, 0.9429723]);
        var scale = tf.tensor1d([-0.5607271, 0.9878457, 0.25181573]);
        var varianceEpsilon = .001;
        var result = tf.batchNorm3d(x, mean, variance, offset, scale, varianceEpsilon);
        test_util_1.expectArraysClose(result, [
            0.59352049, -0.66135202, 0.5610874, -0.92077015, -1.45341019, 1.52106473,
            -0.07704776, 0.26144429, 1.28010017, -1.14422404, -1.15776136, 1.15425493,
            1.82644104, -0.52249442, 1.04803919, 0.74932291, 0.40568101, 1.2844412
        ]);
    });
});
jasmine_util_1.describeWithFlags('batchNormalization2D', test_util_1.ALL_ENVS, function () {
    it('simple batchnorm2D, no offset or scale, 2x2', function () { return __awaiter(_this, void 0, void 0, function () {
        var xT, meanT, varianceT, varianceEpsilon, result, x, mean, variance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xT = tf.tensor2d([2, 4, 9, 23], [2, 2]);
                    meanT = tf.tensor1d([1, 2]);
                    varianceT = tf.tensor1d([2, 3]);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization2d(xT, meanT, varianceT, varianceEpsilon, undefined, undefined);
                    return [4, xT.buffer()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.buffer()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.buffer()];
                case 3:
                    variance = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        (x.get(0, 0) - mean.get(0)) * 1 /
                            Math.sqrt(variance.get(0) + varianceEpsilon),
                        (x.get(0, 1) - mean.get(1)) * 1 /
                            Math.sqrt(variance.get(1) + varianceEpsilon),
                        (x.get(1, 0) - mean.get(0)) * 1 /
                            Math.sqrt(variance.get(0) + varianceEpsilon),
                        (x.get(1, 1) - mean.get(1)) * 1 /
                            Math.sqrt(variance.get(1) + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('simple batchnorm2D, no offset, 2x2', function () { return __awaiter(_this, void 0, void 0, function () {
        var xT, meanT, varianceT, scaleT, varianceEpsilon, result, x, mean, variance, scale;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xT = tf.tensor2d([2, 4, 9, 23], [2, 2]);
                    meanT = tf.tensor1d([1, 2]);
                    varianceT = tf.tensor1d([2, 3]);
                    scaleT = tf.tensor1d([4, 5]);
                    varianceEpsilon = .001;
                    result = tf.batchNormalization2d(xT, meanT, varianceT, varianceEpsilon, scaleT, undefined);
                    return [4, xT.buffer()];
                case 1:
                    x = _a.sent();
                    return [4, meanT.buffer()];
                case 2:
                    mean = _a.sent();
                    return [4, varianceT.buffer()];
                case 3:
                    variance = _a.sent();
                    return [4, scaleT.buffer()];
                case 4:
                    scale = _a.sent();
                    test_util_1.expectArraysClose(result, [
                        (x.get(0, 0) - mean.get(0)) * scale.get(0) /
                            Math.sqrt(variance.get(0) + varianceEpsilon),
                        (x.get(0, 1) - mean.get(1)) * scale.get(1) /
                            Math.sqrt(variance.get(1) + varianceEpsilon),
                        (x.get(1, 0) - mean.get(0)) * scale.get(0) /
                            Math.sqrt(variance.get(0) + varianceEpsilon),
                        (x.get(1, 1) - mean.get(1)) * scale.get(1) /
                            Math.sqrt(variance.get(1) + varianceEpsilon)
                    ]);
                    return [2];
            }
        });
    }); });
    it('simple batchnorm2D, no scale, 2x2', function () {
        var xT = tf.tensor2d([2, 4, 9, 23], [2, 2]);
        var meanT = tf.tensor1d([1, 2]);
        var varianceT = tf.tensor1d([2, 3]);
        var offsetT = tf.tensor1d([4, 5]);
        var varianceEpsilon = .001;
        var result = tf.batchNormalization2d(xT, meanT, varianceT, varianceEpsilon, undefined, offsetT);
        var offset = offsetT.arraySync();
        var mean = meanT.arraySync();
        var variance = varianceT.arraySync();
        var x = xT.arraySync();
        test_util_1.expectArraysClose(result, [
            offset[0] +
                (x[0][0] - mean[0]) * 1 / Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[0][1] - mean[1]) * 1 / Math.sqrt(variance[1] + varianceEpsilon),
            offset[0] +
                (x[1][0] - mean[0]) * 1 / Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[1][1] - mean[1]) * 1 / Math.sqrt(variance[1] + varianceEpsilon)
        ]);
    });
    it('simple batchnorm2D, 2x2', function () {
        var xT = tf.tensor2d([2, 4, 9, 23], [2, 2]);
        var meanT = tf.tensor1d([1, 2]);
        var varianceT = tf.tensor1d([2, 3]);
        var offsetT = tf.tensor1d([3, 4]);
        var scaleT = tf.tensor1d([4, 5]);
        var varianceEpsilon = .001;
        var result = tf.batchNormalization2d(xT, meanT, varianceT, varianceEpsilon, scaleT, offsetT);
        var offset = offsetT.arraySync();
        var mean = meanT.arraySync();
        var variance = varianceT.arraySync();
        var scale = scaleT.arraySync();
        var x = xT.arraySync();
        test_util_1.expectArraysClose(result, [
            offset[0] +
                (x[0][0] - mean[0]) * scale[0] /
                    Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[0][1] - mean[1]) * scale[1] /
                    Math.sqrt(variance[1] + varianceEpsilon),
            offset[0] +
                (x[1][0] - mean[0]) * scale[0] /
                    Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[1][1] - mean[1]) * scale[1] /
                    Math.sqrt(variance[1] + varianceEpsilon)
        ]);
    });
    it('simple batchnorm2D gradients, 2x2', function () {
        var x = tf.tensor2d([2, 4, 9, 23], [2, 2]);
        var mean = tf.tensor1d([1, 2]);
        var variance = tf.tensor1d([2, 3]);
        var offset = tf.tensor1d([3, 4]);
        var scale = tf.tensor1d([2, 5]);
        var varianceEpsilon = .001;
        var dy = tf.tensor2d([1, 1, 1, 1], [2, 2]);
        var gradX = tf.grad(function (x) { return tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon); })(x, dy);
        test_util_1.expectArraysClose(gradX, tf.tensor2d([1.414, 2.887, 1.414, 2.887], [2, 2]));
        var gradMean = tf.grad(function (mean) { return tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon); })(mean, dy);
        test_util_1.expectArraysClose(gradMean, tf.tensor1d([-2.828, -5.773]));
        var gradVariance = tf.grad(function (variance) { return tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon); })(variance, dy);
        test_util_1.expectArraysClose(gradVariance, tf.tensor1d([-3.180, -11.060]));
        var gradOffset = tf.grad(function (offset) { return tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon); })(offset, dy);
        test_util_1.expectArraysClose(gradOffset, tf.onesLike(offset).mul(tf.scalar(2)));
        var gradScale = tf.grad(function (scale) { return tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon); })(scale, dy);
        test_util_1.expectArraysClose(gradScale, tf.tensor1d([6.362, 13.277]));
    });
    it('batchnorm2D gradients, same shapes in x, mean and variance', function () {
        var x = tf.tensor2d([10, 20, 30, 40], [2, 2]);
        var mean = tf.tensor2d([0, 5, 10, 15], [2, 2]);
        var variance = tf.tensor2d([2, 4, 6, 8], [2, 2]);
        var scale = tf.tensor2d([2, 5, 2, 5], [2, 2]);
        var offset = tf.tensor2d([0, 0, 0, 0], [2, 2]);
        var varianceEpsilon = .001;
        var dy = tf.tensor2d([1, 1, 1, 1], [2, 2]);
        var gradX = tf.grad(function (x) { return tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon); })(x, dy);
        test_util_1.expectArraysClose(gradX, tf.tensor2d([1.414, 2.500, 0.816, 1.768], [2, 2]));
        var gradMean = tf.grad(function (mean) { return tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon); })(mean, dy);
        test_util_1.expectArraysClose(gradMean, tf.tensor2d([-1.414, -2.500, -0.816, -1.768], [2, 2]));
        var gradVariance = tf.grad(function (variance) { return tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon); })(variance, dy);
        test_util_1.expectArraysClose(gradVariance, tf.tensor2d([-3.533, -4.686, -1.360, -2.762], [2, 2]));
        var gradOffset = tf.grad(function (offset) { return tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon); })(offset, dy);
        test_util_1.expectArraysClose(gradOffset, tf.onesLike(offset));
        var gradScale = tf.grad(function (scale) { return tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon); })(scale, dy);
        test_util_1.expectArraysClose(gradScale, tf.tensor2d([7.069, 7.499, 8.164, 8.838], [2, 2]));
    });
    it('batchnorm2D matches tensorflow, 3x3', function () {
        var x = tf.tensor2d([
            0.3136892, 0.92389025, 0.594782, 0.05021042, 0.67545404, 0.93910035,
            0.13277993, 0.96474269, 0.88608916
        ], [3, 3]);
        var mean = tf.tensor1d([0.19526312, 0.74857256, 0.45166398]);
        var variance = tf.tensor1d([0.22963001, 0.61521992, 0.46623685]);
        var offset = tf.tensor1d([0.43098484, 0.77712237, 0.47916298]);
        var scale = tf.tensor1d([0.62186907, 0.85673736, 0.19201061]);
        var varianceEpsilon = .001;
        var result = tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon);
        test_util_1.expectArraysClose(result, [
            0.58433646, 0.96846228, 0.51936529, 0.24315402, 0.69732157, 0.61608542,
            0.35007446, 1.01304821, 0.60119441
        ]);
    });
    it('throws when passed x as a non-tensor', function () {
        var mean = tf.tensor1d([1, 2]);
        var variance = tf.tensor1d([2, 3]);
        expect(function () { return tf.batchNorm({}, mean, variance); })
            .toThrowError(/Argument 'x' passed to 'batchNorm' must be a Tensor/);
    });
    it('throws when passed mean as a non-tensor', function () {
        var x = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
        var variance = tf.tensor1d([2, 3]);
        expect(function () { return tf.batchNorm(x, {}, variance); })
            .toThrowError(/Argument 'mean' passed to 'batchNorm' must be a Tensor/);
    });
    it('throws when passed variance as a non-tensor', function () {
        var x = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
        var mean = tf.tensor1d([1, 2]);
        var e = /Argument 'variance' passed to 'batchNorm' must be a Tensor/;
        expect(function () { return tf.batchNorm(x, mean, {}); }).toThrowError(e);
    });
    it('throws when passed scale as a non-tensor', function () {
        var x = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
        var mean = tf.tensor1d([1, 2]);
        var variance = tf.tensor1d([2, 3]);
        var epsilon = .001;
        expect(function () { return tf.batchNorm(x, mean, variance, epsilon, {}); })
            .toThrowError(/Argument 'scale' passed to 'batchNorm' must be a Tensor/);
    });
    it('throws when passed offset as a non-tensor', function () {
        var x = tf.tensor4d([2, 4, 9, 23], [2, 1, 1, 2]);
        var mean = tf.tensor1d([1, 2]);
        var variance = tf.tensor1d([2, 3]);
        var epsilon = .001;
        var scale = tf.tensor1d([0.62186907, 0.85673736, 0.19201061]);
        var e = /Argument 'offset' passed to 'batchNorm' must be a Tensor/;
        expect(function () { return tf.batchNorm(x, mean, variance, {}, scale, epsilon); })
            .toThrowError(e);
    });
    it('accepts a tensor-like object', function () {
        var x = [[2, 4], [9, 23]];
        var mean = [1, 2];
        var variance = [2, 3];
        var offset = [3, 4];
        var scale = [4, 5];
        var varianceEpsilon = .001;
        var result = tf.batchNorm2d(x, mean, variance, offset, scale, varianceEpsilon);
        test_util_1.expectArraysClose(result, [
            offset[0] +
                (x[0][0] - mean[0]) * scale[0] /
                    Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[0][1] - mean[1]) * scale[1] /
                    Math.sqrt(variance[1] + varianceEpsilon),
            offset[0] +
                (x[1][0] - mean[0]) * scale[0] /
                    Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[1][1] - mean[1]) * scale[1] /
                    Math.sqrt(variance[1] + varianceEpsilon)
        ]);
    });
    it('throws error when x is a string tensor', function () {
        var mean = [1, 2];
        var variance = [2, 3];
        var offset = [3, 4];
        var scale = [4, 5];
        var varianceEpsilon = .001;
        var f = function () { return tf.batchNorm2d([['a', 'b'], ['c', 'd']], mean, variance, offset, scale, varianceEpsilon); };
        expect(f).toThrowError(/Argument 'x' passed to 'batchNorm' must be numeric/);
    });
    it('throws error when mean is a string tensor', function () {
        var x = [[2, 4], [9, 23]];
        var variance = [2, 3];
        var offset = [3, 4];
        var scale = [4, 5];
        var varianceEpsilon = .001;
        var f = function () {
            return tf.batchNorm2d(x, ['a', 'b'], variance, offset, scale, varianceEpsilon);
        };
        expect(f).toThrowError(/Argument 'mean' passed to 'batchNorm' must be numeric/);
    });
    it('throws error when variance is a string tensor', function () {
        var x = [[2, 4], [9, 23]];
        var mean = [1, 2];
        var offset = [3, 4];
        var scale = [4, 5];
        var varianceEpsilon = .001;
        var f = function () {
            return tf.batchNorm2d(x, mean, ['a', 'b'], offset, scale, varianceEpsilon);
        };
        expect(f).toThrowError(/'variance' passed to 'batchNorm' must be numeric/);
    });
    it('throws error when scale is a string tensor', function () {
        var x = [[2, 4], [9, 23]];
        var mean = [1, 2];
        var variance = [2, 3];
        var offset = [3, 4];
        var varianceEpsilon = .001;
        var f = function () {
            return tf.batchNorm2d(x, mean, variance, offset, ['a', 'b'], varianceEpsilon);
        };
        expect(f).toThrowError(/'scale' passed to 'batchNorm' must be numeric/);
    });
    it('throws error when offset is a string tensor', function () {
        var x = [[2, 4], [9, 23]];
        var mean = [1, 2];
        var variance = [2, 3];
        var scale = [4, 5];
        var varianceEpsilon = .001;
        var f = function () {
            return tf.batchNorm2d(x, mean, variance, ['a', 'b'], scale, varianceEpsilon);
        };
        expect(f).toThrowError(/'offset' passed to 'batchNorm' must be numeric/);
    });
});
jasmine_util_1.describeWithFlags('deprecated batchNormalization', test_util_1.ALL_ENVS, function () {
    it('simple batchnorm2D, 2x2', function () {
        var xT = tf.tensor2d([2, 4, 9, 23], [2, 2]);
        var meanT = tf.tensor1d([1, 2]);
        var varianceT = tf.tensor1d([2, 3]);
        var offsetT = tf.tensor1d([3, 4]);
        var scaleT = tf.tensor1d([4, 5]);
        var varianceEpsilon = .001;
        var result = tf.batchNormalization(xT, meanT, varianceT, varianceEpsilon, scaleT, offsetT);
        var offset = offsetT.arraySync();
        var mean = meanT.arraySync();
        var variance = varianceT.arraySync();
        var scale = scaleT.arraySync();
        var x = xT.arraySync();
        test_util_1.expectArraysClose(result, [
            offset[0] +
                (x[0][0] - mean[0]) * scale[0] /
                    Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[0][1] - mean[1]) * scale[1] /
                    Math.sqrt(variance[1] + varianceEpsilon),
            offset[0] +
                (x[1][0] - mean[0]) * scale[0] /
                    Math.sqrt(variance[0] + varianceEpsilon),
            offset[1] +
                (x[1][1] - mean[1]) * scale[1] /
                    Math.sqrt(variance[1] + varianceEpsilon)
        ]);
        var result2 = tf.batchNormalization2d(xT, meanT, varianceT, varianceEpsilon, scaleT, offsetT);
        test_util_1.expectArraysClose(result, result2);
    });
});
//# sourceMappingURL=batchnorm_test.js.map