// business logic
export {root} from './react/root-handler';
export * from './core/merge-events';
export * from './core/types';
export * from './core/config';
export * from './core/private-context';
export * from "./function-decor";

// legacy :
//bases
export * from './old/bases/observable-component';
//mixins
export * from './old/mixins/disposable-decorator';
export * from './old/mixins/global-id-decorator';
//utils
export * from './old/utils/class-decor/index';
export * from './old/utils/react-decor';
export * from './core/disposers';

// custom exports:
import {after as FDAfter, before as FDBefore, middleware as FDMiddleware} from "./function-decor";
import {after as CDAfter, before as CDBefore, middleware as CDMiddleware} from "./old/utils/class-decor/index";

function mergeFuncAndClass<F extends Function, C extends Function>(fDFunc:F, cDFunc:C) : F & C{
    function ApiHook() {
        if (arguments.length > 1) {
            return cDFunc.apply(null, arguments);
        } else {
            return fDFunc.apply(null, arguments);
        }
    }
    Object.setPrototypeOf(ApiHook, cDFunc);
    return ApiHook as any as F & C;
}

export const before = mergeFuncAndClass(FDBefore, CDBefore);
export const after = mergeFuncAndClass(FDAfter, CDAfter);
export const middleware = mergeFuncAndClass(FDMiddleware, CDMiddleware);
