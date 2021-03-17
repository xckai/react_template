import { connect, ConnectedProps as _connectedProps } from 'react-redux';
import {Slice, SliceCaseReducers } from '@reduxjs/toolkit';
import { createStore, combineReducers } from 'redux';
export type ConnectedProps<TConnector> = _connectedProps<TConnector>;
const staticReducers = {
  App: (state = null, action: any) => {
    return state;
  }
};
const appAsyncReducers: Partial<Record<string, (state: Object, action: Object) => Object>> = {};
function createReducer(asyncReducers?: any) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers
  });
}

function getAppStore() {
  const store = createStore(createReducer());
  return {
    ...store,
    injectReducer: (key: string, asyncReducer: any) => {
      appAsyncReducers[key] = asyncReducer;
      store.replaceReducer(createReducer(appAsyncReducers));
    }
  };
}
/** 全局Store，在入口处初始化引用 */
export const AppStore = getAppStore();
/**
 * @description:
 * @param {String} pageName 页面名称，作为页面key使用，不同页面不要使用相同的名称;
 * @param {IOwnState} initPageState 初始化页面redux状态
 * @param {IMapReducer} reducers 页面的redux reducer对象
 * @return {*}
 */
// export function CreatePageStoreConnector<IOwnState, IMapReducer extends (ownState: IOwnState) => any>(
//   pageName: string,
//   initPageState: IOwnState,
//   reducers: IMapReducer,
//   asyncReducers?: IMapReducer
// ) {
//   const mapStateToProps = (state: any) => {
//     return state[pageName] as IOwnState;
//   };
//   function reducersWrapper(stat: any, action: any) {
//     if (stat === undefined) {
//       stat = initPageState;
//     }
//     if (!action.type) {
//       return stat;
//     }
//     const [crtPageName, crtType] = action.type.split('::');
//     if (crtPageName === pageName) {
//       const _reducers: any = reducers(stat);
//       if (_reducers[crtType]) {
//         return _reducers[crtType](action.payload);
//       } else {
//         throw new Error(` reducer '${crtType}' is not found in ${pageName}, `);
//       }
//     }
//     return stat;
//   }
//   const mapDispatchToProps = (dispatch: any) => {
//     const reducersObj: any = {};
//     Object.keys(reducers(initPageState)).map((k) => {
//       reducersObj[k] = function (payload?: any) {
//         dispatch({ payload: payload, type: `${pageName}::${k}` });
//       };
//     });
//     return reducersObj as ReturnType<IMapReducer>;
//   };
//   AppStore.injectReducer(pageName, reducersWrapper);
//   return connect(mapStateToProps, mapDispatchToProps);
// }

export function CreatePageSliceStoreConnector<State, CaseReducers extends SliceCaseReducers<State>, Name extends string>(
  pageSlice: Slice<State, CaseReducers, Name>
) {
  AppStore.injectReducer(pageSlice.name, pageSlice.reducer);
  const mapStateToProps = (state: any) => {
    return state[pageSlice.name] as State
  };
  const mapDispatchToProps = (dispatch: any) => {
    return {
      ...pageSlice.actions,
      dispatch
    };
  };
  return connect(mapStateToProps, mapDispatchToProps);
}
