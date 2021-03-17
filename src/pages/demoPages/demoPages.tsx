import React, { PureComponent } from 'react';
import { Layout, Button, message, Space, Table, Tag, Input, Rate } from 'antd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectedProps, CreatePageSliceStoreConnector } from '../../common/pageStore';
import { Link } from 'react-router-dom';
import { DemoService } from '../../services/demoServices';
const { Content, Header } = Layout;
const defaultPageState = {
  title: 'Demo Page',
  listData: [] as Array<any>
};
const connector = CreatePageSliceStoreConnector(
  createSlice({
    name: 'Demo',
    initialState: defaultPageState,
    reducers: {
      setListData: (state, action: PayloadAction<Array<any>>) => {
        state.listData = action.payload;
      }
    }
  })
);
type PropsFromRedux = ConnectedProps<typeof connector>;
class Cls extends PureComponent<PropsFromRedux> {
  componentDidMount() {
    DemoService.getDemoList().then((res) => {
      this.props.dispatch(this.props.setListData(res.data));
    });
  }
  renderList() {
    const columns = [
      {
        title: ' ',
        width: '4%',
        key: 'Title',
        render: (obj: any, record: any, idx: number) => <span>{idx + 1}</span>
      },
      {
        title: '题目名称',
        dataIndex: 'Title',
        key: 'Title',
        render: (text: string) => <span>{text}</span>
      },
      {
        title: '难度系数',
        dataIndex: 'Stars',
        key: 'Stars',
        sorter: (a: any, b: any) => {
          return b.Stars - a.Stars;
        },
        render: (number: number) => <Rate disabled allowHalf defaultValue={number} />
      },
      {
        title: '是否已通过',
        dataIndex: 'IsPassed',
        key: 'IsPassed',
        filters: [
          { text: '已通过', value: true },
          { text: '未通过', value: false }
        ],
        onFilter: (value: any, obj: any) => !!obj.IsPassed == value,
        render: (passed: boolean) => (passed ? <Tag color="green">已通过</Tag> : <Tag color="red">未通过</Tag>)
      },
      {
        title: '最佳成绩',
        dataIndex: 'TimeCost',
        key: 'TimeCost',
        render: (timeCost: number, recoder: any) => (recoder.IsPassed ? <span>{Math.round(recoder.TimeCost ?? 0) / 1000}s</span> : '--')
      },
      {
        title: '排名',
        dataIndex: 'Rank',
        key: 'Rank',
        render: (rank: number, recoder: any) => (recoder.IsPassed ? <span>{rank}</span> : '--')
      },
      {
        title: '',
        dataIndex: 'Id',
        key: 'Id',
        render: (id: string) => (
          <Space size="middle">
            <Link to={`/main/topicdetail/${id}`}>
              <Button type="primary">
                <span>进入测试</span>
              </Button>
            </Link>
          </Space>
        )
      }
    ];
    return (
      <Table
        locale={{
          filterConfirm: '确定',
          filterReset: '重置'
        }}
        rowKey={(row) => row.Id}
        columns={columns}
        dataSource={this.props.listData}
        size="middle"
        bordered
      />
    );
  }
  render() {
    const dispatch = this.props.dispatch;
    return (
      <Layout style={{ height: '100%' }}>
        <Header>
          {' '}
          <h5 style={{ color: 'white' }}>{this.props.title}</h5>{' '}
        </Header>
        <Content style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '95%', maxWidth: 1200, margin: 20 }}>{this.renderList()}</div>
        </Content>
      </Layout>
    );
  }
}
export const DemoPage = connector(Cls);
