import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { ConnectedProps, CreatePageSliceStoreConnector } from '../../common/pageStore';

const  defaultReduxState = {
  value: 1,
};
const connector = CreatePageSliceStoreConnector(
  createSlice({
    name: 'FunctionComponentPage',
    initialState: defaultReduxState,
    reducers: {
      increment: (state) => {
        state.value += 1;
      },
      decrement: (state) => {
        state.value -= 1;
      },
      // Use the PayloadAction type to declare the contents of `action.payload`
      incrementByAmount: (state, action: PayloadAction<number>) => {
        state.value += action.payload;
      }
    }
  })
);
type PropsFromRedux = ConnectedProps<typeof connector>;

function InnerFnComponent(props: PropsFromRedux) {
  const dispatch = useDispatch();
  return (
    <>
      <h3>Function Component Page 示例</h3>
      <div>分数 : {props.value}</div>
      <div>
        <button
          onClick={() => {
            dispatch(props.increment());
          }}
        >
          +1
        </button>
        <button onClick={() => dispatch(props.incrementByAmount(2))}>+2</button>
      </div>
    </>
  );
}

export const FunctionComponentPage = connector(InnerFnComponent);
