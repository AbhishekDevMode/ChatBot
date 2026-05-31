import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import App from './src/App.jsx';

try {
  const html = renderToString(
    <StaticRouter location="/">
      <App />
    </StaticRouter>
  );
  console.log("SUCCESS");
} catch (e) {
  console.error("ERROR:", e);
}
