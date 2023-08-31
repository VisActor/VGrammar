# Use in React

When using VGrammar in React, there are a few main concerns:

1.  **When to create a new visual instance**: When used in the browser, VGrammar is a graphics drawing based on Canvas, so the most basic point is to wait for the container dom element to be rendered and mounted on the dom tree before creating a visual instance;
2.  **Uninstall visual instances in time**: Before the component is unloaded, the instance created by VGrammar needs to be unloaded to prevent memory leaks

[View the online demo](https://codesandbox.io/s/visactor-vgammar-react-demo-ztq9rc)

## Class Component

To use VGrammar with React Class Component, you can refer to the following core code:

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

      view.runAsync();
      this.view = view;
    } else if (this.view) {
      this.view.updateSpec(this.parseSpec() as any);
      this.view.runAsync();
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

## Function Component Package

To VGrammar in Function Component, you can refer to the following core code:

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

        view.runAsync();

        viewRef.current = view;
        (window as any).treemap = view;

        return true;
      } else if (viewRef.current) {
        viewRef.current.updateSpec(parseSpec(chartProps) as any);
        viewRef.current.runAsync();

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
