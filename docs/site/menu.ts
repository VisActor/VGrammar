import { examplesMenu } from './examples/menu';
import { tutorialsMenu } from './tutorials/menu';
import { apiMenu } from './api/menu';


export const menus = [
  {
    title: '案例',
    key: 'examples',
    menu: examplesMenu,
  },
  {
    title: '教程',
    key: 'tutorials',
    menu: tutorialsMenu,
  },
  {
    title: 'API',
    key: 'api',
    menu: apiMenu,
  }
]
