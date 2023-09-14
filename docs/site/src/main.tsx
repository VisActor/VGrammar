import ReactDOM from 'react-dom/client';
import * as VRender from '@visactor/vrender';
import * as VGrammar from '@visactor/vgrammar';
import * as VGrammarHierarchy from '@visactor/vgrammar-hierarchy';
import * as VGrammarSankey from '@visactor/vgrammar-sankey';
import * as VGrammarWordcloud from '@visactor/vgrammar-wordcloud';
import * as VGrammarWordcloudShape from '@visactor/vgrammar-wordcloud-shape';
import * as VisUtil from '@visactor/vutils';
import { Plot } from '@visactor/vgrammar-plot'
import { App } from './app';

import '@arco-design/web-react/dist/css/arco.css';

(window as any).VRender = VRender;
(window as any).View = VGrammar.View;
(window as any).Plot = Plot;
(window as any).VGrammar = VGrammar;
(window as any).VGrammarHierarchy = VGrammarHierarchy;
(window as any).VGrammarSankey = VGrammarSankey;
(window as any).VGrammarWordcloud = VGrammarWordcloud;
(window as any).VGrammarWordcloudShape = VGrammarWordcloudShape;
(window as any).CONTAINER_ID = 'chart';
(window as any).VisUtil = VisUtil;

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
