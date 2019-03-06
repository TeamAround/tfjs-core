"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("../util");
function assertParamsValid(input, begin, size) {
    util.assert(input.rank === begin.length, "Error in slice" + input.rank + "D: Length of begin " + begin + " must " +
        ("match the rank of the array (" + input.rank + ")."));
    util.assert(input.rank === size.length, "Error in slice" + input.rank + "D: Length of size " + size + " must " +
        ("match the rank of the array (" + input.rank + ")."));
    for (var i = 0; i < input.rank; ++i) {
        util.assert(begin[i] + size[i] <= input.shape[i], "Error in slice" + input.rank + "D: begin[" + i + "] + size[" + i + "] " +
            ("(" + (begin[i] + size[i]) + ") would overflow input.shape[" + i + "] (" + input.shape[i] + ")"));
    }
}
exports.assertParamsValid = assertParamsValid;
function getStridedSlicedInfo(shape, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask) {
    if (beginMask === void 0) { beginMask = 0; }
    if (endMask === void 0) { endMask = 0; }
    if (ellipsisMask === void 0) { ellipsisMask = 0; }
    if (newAxisMask === void 0) { newAxisMask = 0; }
    if (shrinkAxisMask === void 0) { shrinkAxisMask = 0; }
    if (ellipsisMask !== 0) {
        throw new Error('ellipsis mask is not yet supported');
    }
    if (newAxisMask !== 0) {
        throw new Error('new axis mask is not yet supported');
    }
    var startIndex = [];
    var endIndex = [];
    var shrinkAxis = [];
    for (var i = 0; i < shape.length; i++) {
        startIndex[i] = startForAxis(beginMask, begin, strides, shape, i);
        endIndex[i] = stopForAxis(endMask, end, strides, shape, i);
        if (shrinkAxisMask & 1 << i) {
            endIndex[i] = startIndex[i] + 1;
            shrinkAxis.push(i);
        }
    }
    var size = new Array(shape.length).fill(0);
    size = size.map(function (d, i) {
        var count = 0;
        for (var start = startIndex[i]; !(strides[i] > 0 ? start >= endIndex[i] : start <= endIndex[i]); start += strides[i]) {
            count += 1;
        }
        return count;
    });
    return [startIndex, size, shrinkAxis];
}
exports.getStridedSlicedInfo = getStridedSlicedInfo;
function startForAxis(beginMask, startIndices, strides, inputShape, axis) {
    var start = startIndices[axis];
    if (beginMask & 1 << axis) {
        if (strides[axis] > 0) {
            start = Number.MIN_SAFE_INTEGER;
        }
        else {
            start = Number.MAX_SAFE_INTEGER;
        }
    }
    var axisSize = inputShape[axis];
    if (start < 0) {
        start += axisSize;
    }
    start = util.clamp(0, start, axisSize - 1);
    return start;
}
exports.startForAxis = startForAxis;
function stopForAxis(endMask, stopIndices, strides, inputShape, axis) {
    var stop = stopIndices[axis];
    if (endMask & (1 << axis)) {
        if (strides[axis] > 0) {
            stop = Number.MAX_SAFE_INTEGER;
        }
        else {
            stop = Number.MIN_SAFE_INTEGER;
        }
    }
    var axisSize = inputShape[axis];
    if (stop < 0) {
        stop += axisSize;
    }
    if (strides[axis] > 0) {
        stop = util.clamp(0, stop, axisSize);
    }
    else {
        stop = util.clamp(-1, stop, axisSize - 1);
    }
    return stop;
}
exports.stopForAxis = stopForAxis;
function isSliceContinous(shape, begin, size) {
    var firstNonOneAxis = size.length;
    for (var i = 0; i < size.length; i++) {
        if (size[i] > 1) {
            firstNonOneAxis = i;
            break;
        }
    }
    for (var i = firstNonOneAxis + 1; i < size.length; i++) {
        if (begin[i] > 0 || size[i] !== shape[i]) {
            return false;
        }
    }
    return true;
}
exports.isSliceContinous = isSliceContinous;
function computeFlatOffset(begin, strides) {
    var flatOffset = begin.length > 0 ? begin[begin.length - 1] : 1;
    for (var i = 0; i < begin.length - 1; i++) {
        flatOffset += begin[i] * strides[i];
    }
    return flatOffset;
}
exports.computeFlatOffset = computeFlatOffset;
//# sourceMappingURL=slice_util.js.map