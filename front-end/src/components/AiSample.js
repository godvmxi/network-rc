import React, { Component } from "react";
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  PauseOutlined,
  ImportOutlined,
  ExportOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Form, Button, List, Card } from "antd";
import { Link } from "@reach/router";

export const aiAction = {
  left: {
    icon: <ArrowLeftOutlined />,
    name: "左转弯",
  },
  right: {
    icon: <ArrowRightOutlined />,
    name: "右转弯",
  },
  forward: {
    icon: <ArrowUpOutlined />,
    name: "前进",
  },
  back: {
    icon: <ArrowDownOutlined />,
    name: "后退",
  },
  stop: {
    icon: <PauseOutlined />,
    name: "停止",
  },
};

export default class AiSample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleList: props.sampleList || [],
    };
  }

  c;

  add(example) {
    // ToDo: get image
    const { sampleList } = this.state;
    sampleList.unshift({
      ...example,
      img: undefined,
    });
    this.setState({ sampleList });
  }

  update(index, action) {
    this.setState((state) => {
      state.sampleList[index].action = action;
      return state;
    });
  }

  remove(index) {
    const { sampleList } = this.state;
    sampleList.splice(index, 1);
    this.setState({ sampleList });
  }

  clear = () => {
    this.setState({ sampleList: [] });
  };

  upload() {}

  download() {}

  render() {
    const {
      clear,
      props: { onFinish, cameraEnable },
    } = this;
    const { sampleList } = this.state;
    return (
      <div className="ai-sample">
        <Form layout="inline" className="ai-sample-form" size="small">
          {Object.keys(aiAction).map((key) => (
            <Form.Item>
              <Button
                icon={aiAction[key].icon}
                onClick={() => this.add({ action: key })}
                disabled={!cameraEnable}
              />
            </Form.Item>
          ))}
          <Form.Item>
            <Button icon={<ImportOutlined />}>导入</Button>
          </Form.Item>
          <Form.Item>
            <Button icon={<ExportOutlined />} disabled={!sampleList.length}>
              导出
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="danger" disabled={!sampleList.length} onClick={clear}>
              清除
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to="../train">
              <Button
                type="primary"
                disabled={sampleList.length < 10}
                onClick={() => {
                  onFinish(sampleList);
                }}
              >
                下一步
              </Button>
            </Link>
          </Form.Item>
        </Form>
        <List
          size="small"
          className="ai-example-list"
          grid={{ gutter: 16, column: 4 }}
          itemLayout="vertical"
          pagination={{
            pageSize: 12,
          }}
          dataSource={sampleList}
          renderItem={({ img, action }, index) => (
            <List.Item>
              <Card
                size="small"
                title={aiAction[action].icon}
                actions={[
                  <Button
                    size="small"
                    icon={<CloseOutlined />}
                    type="danger"
                    onClick={() => this.remove(index)}
                  />,
                ]}
              >
                <img style={{ maxWidth: "100%" }} src={img} alt="example" />
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
