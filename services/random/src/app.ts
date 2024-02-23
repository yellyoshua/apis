import {Hono} from 'hono';
import {prettyJSON} from 'hono/pretty-json';

const app = new Hono();

app.use(prettyJSON());

app.get('/username', (c) => {
  const username = Math.random().toString(36).substring(2, 15);
  return c.json({username});
});

app.get('/email', (c) => {
  const email = `${Math.random().toString(36).substring(2, 15)}@example.com`;
  return c.json({email});
});

app.get('/phone', (c) => {
  const phone = `+1${Math.random().toString().substring(2, 12)}`;
  return c.json({phone});
});

app.get('/', (c) => {
  return c.json({
    services: [
      {name: 'username', path: '/username'},
      {name: 'email', path: '/email'},
      {name: 'phone', path: '/phone'}
    ]
  })
});

export default app;
