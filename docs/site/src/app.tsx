import { useState } from 'react';
import { RouteObject, RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { LanguageContext, LanguageEnum, getStoredLanguage, storeLanguage } from './i18n';
import menu from '../menu.json';
import { Markdown } from './markdown';
import { Option } from './option';
import { Demo } from './demo';

const menuRoutes: RouteObject[] = menu.map(menuItem => {
  if (menuItem.type === 'markdown-template') {
    return {
      path: `/vgrammar/${menuItem.menu}`,
      element: <Option />,
      children: [
        {
          path: '*',
          element: <Option />
        }
      ]
    };
  } else if (menuItem.type === 'demos') {
    return {
      path: `/vgrammar/${menuItem.menu}`,
      element: <Demo />,
      children: [
        {
          path: '*',
          element: <Demo />
        }
      ]
    };
  }
  return {
    path: `/vgrammar/${menuItem.menu}`,
    element: <Markdown />,
    children: [
      {
        path: '*',
        element: <Markdown />
      }
    ]
  };
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/vgrammar/examples" />
  },
  ...menuRoutes
]);

export function App() {
  const [language, setLanguage] = useState<LanguageEnum>(getStoredLanguage());
  const languageValue = {
    language,
    setLanguage: (language: LanguageEnum) => {
      setLanguage(language);
      storeLanguage(language);
    }
  };
  return (
    <LanguageContext.Provider value={languageValue}>
      <RouterProvider router={router} />
    </LanguageContext.Provider>
  );
}
