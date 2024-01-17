# 在 React 中使用

在 React 中使用 VGrammar 的时候，主要需要关心一下几点：

1. **新建可视化实例的时机**：在浏览器中使用时，VGrammar 是基于 Canvas 实现的图形绘制，所以最基础的一点就是需要等待容器 dom 元素渲染完成，挂载到 dom 树上后，再去创建可视化实例；
2. **及时卸载可视化实例**：当组件被卸载之前，需要卸载 VGrammar 创建的实例，防止造成内存泄露

[查看在线 demo](https://codesandbox.io/s/visactor-vgammar-react-demo-ztq9rc)

## Class Component 封装

使用 React Class Component 封装 VGrammar，可以参考下列核心代码：

```ts
export class BarChart extends Component<BarChartProps> {
  view?: IView;

  parseSpec = () => {
    return {
      // this is a spec
    };
  };

  containerRef = createRef<HTMLDivElement>();

  createOrUpdateChart() {
    if (this.containerRef.current && !this.view) {
      const view = new View({
        autoFit: true,
        container: this.containerRef.current,
        hover: true
      });
      view.parseSpec(this.parseSpec() as any);

      view.run();
      this.view = view;
    } else if (this.view) {
      this.view.updateSpec(this.parseSpec() as any);
      this.view.run();
    }
  }

  componentDidMount() {
    this.createOrUpdateChart();
  }

  componentDidUpdate(prevProps: BarChartProps) {
    if ((this.props.colors && prevProps.colors !== this.props.colors) || prevProps.data !== this.props.data) {
      this.createOrUpdateChart();
    }
  }

  componentWillUnmout() {
    if (this.view) {
      this.view.release();
    }
  }

  render() {
    return <div id="bar-container" style={{ width: '100%', height: 300 }} ref={this.containerRef} />;
  }
}
```

## Function Component 封装

使用 Function Component 封装 VGrammar，可以参考下列核心代码：

```ts
export interface TreemapProps {
  colors?: string[];
}

export const Treemap = (props: TreemapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<IView | null>(null);
  const [inited, setInited] = useState(false);
  const { colors } = props;
  const parseSpec = useCallback((chartProps: TreemapProps) => {
    return {
      // a spec
    };
  }, []);

  const createOrUpdateChart = useCallback(
    (chartProps: TreemapProps) => {
      if (containerRef.current && !viewRef.current) {
        const view = new View({
          autoFit: true,
          container: containerRef.current,
          hover: true
        });
        view.parseSpec(parseSpec(chartProps) as any);

        view.run();

        viewRef.current = view;
        (window as any).treemap = view;

        return true;
      } else if (viewRef.current) {
        viewRef.current.updateSpec(parseSpec(chartProps) as any);
        viewRef.current.run();

        return true;
      }
      return false;
    },
    [parseSpec]
  );

  useEffect(() => {
    registerBasicTransforms();
    registerTreemapTransforms();

    return () => {
      if (viewRef.current) {
        viewRef.current.release();
      }
      viewRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (inited) {
      createOrUpdateChart(props);
    } else {
      setInited(true);
    }
  }, [colors, createOrUpdateChart, inited]);

  return <div id="treemap-container" style={{ width: '100%', height: 400 }} ref={containerRef} />;
};
```
