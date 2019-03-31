import React from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import hasuraDataProvider from "ra-data-hasura";

const headers = {
  "content-type": "application/json"
};
const App = () => (
  <Admin dataProvider={hasuraDataProvider("http://localhost:8080", headers)}>
    <Resource name="chapter" list={ListGuesser} />
    <Resource name="character" list={ListGuesser} />
    <Resource name="work" list={ListGuesser} />
    <Resource name="paragraph" list={ListGuesser} />
  </Admin>
);

export default App;
