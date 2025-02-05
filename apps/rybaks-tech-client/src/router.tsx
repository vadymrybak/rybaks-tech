import { createBrowserRouter } from 'react-router-dom';
import * as React from 'react';
import * as Pages from './view/pages';

export const routes = {
  root: '/',
  foo: '/foo',
  bar: (id: string | number) => `/bar/${id}`,
};

export const router = createBrowserRouter([
  {
    path: routes.root,
    element: <Pages.Foo />,
  },
  {
    path: routes.foo,
    element: <Pages.Foo />,
  },
  {
    path: routes.bar(':id'),
    element: <Pages.Bar />,
  },
]);
