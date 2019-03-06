"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IORouterRegistry = (function () {
    function IORouterRegistry() {
        this.saveRouters = [];
        this.loadRouters = [];
    }
    IORouterRegistry.getInstance = function () {
        if (IORouterRegistry.instance == null) {
            IORouterRegistry.instance = new IORouterRegistry();
        }
        return IORouterRegistry.instance;
    };
    IORouterRegistry.registerSaveRouter = function (saveRouter) {
        IORouterRegistry.getInstance().saveRouters.push(saveRouter);
    };
    IORouterRegistry.registerLoadRouter = function (loadRouter) {
        IORouterRegistry.getInstance().loadRouters.push(loadRouter);
    };
    IORouterRegistry.getSaveHandlers = function (url) {
        return IORouterRegistry.getHandlers(url, 'save');
    };
    IORouterRegistry.getLoadHandlers = function (url, onProgress) {
        return IORouterRegistry.getHandlers(url, 'load', onProgress);
    };
    IORouterRegistry.getHandlers = function (url, handlerType, onProgress) {
        var validHandlers = [];
        var routers = handlerType === 'load' ? this.getInstance().loadRouters :
            this.getInstance().saveRouters;
        routers.forEach(function (router) {
            var handler = router(url, onProgress);
            if (handler !== null) {
                validHandlers.push(handler);
            }
        });
        return validHandlers;
    };
    return IORouterRegistry;
}());
exports.IORouterRegistry = IORouterRegistry;
exports.registerSaveRouter = function (loudRouter) {
    return IORouterRegistry.registerSaveRouter(loudRouter);
};
exports.registerLoadRouter = function (loudRouter) {
    return IORouterRegistry.registerLoadRouter(loudRouter);
};
exports.getSaveHandlers = function (url) {
    return IORouterRegistry.getSaveHandlers(url);
};
exports.getLoadHandlers = function (url, onProgress) {
    return IORouterRegistry.getLoadHandlers(url);
};
//# sourceMappingURL=router_registry.js.map