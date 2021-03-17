import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import React, { PureComponent } from 'react';
import { ConnectedProps, CreatePageSliceStoreConnector } from '../../common/pageStore';

const defaultPageState = {
  value: 1,
  name: '小明'
};
const connector = CreatePageSliceStoreConnector(
  createSlice({
    name: 'ClassComponentPage',
    initialState: defaultPageState,
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
class Cls extends PureComponent<PropsFromRedux> {
  render() {
    const dispatch = this.props.dispatch;
    return (
      <>
        <h3>Class Component Page 示例</h3>
        <div>
          {this.props.name} 分数 : {this.props.value}
        </div>
        <div>
          <button
            onClick={() => {
              dispatch(this.props.increment());
            }}
          >
            +1
          </button>
          <button onClick={() => dispatch(this.props.incrementByAmount(2))}>+2</button>
        </div>
      </>
    );
  }
}
export const ClassComponentPage = connector(Cls);
