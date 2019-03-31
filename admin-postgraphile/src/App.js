import React, { Component } from "react";
import buildGraphcoolProvider from "ra-data-graphcool";
import { Admin, Resource, ListGuesser } from "react-admin";

class App extends Component {
  constructor() {
    super();
    this.state = { dataProvider: null };
  }

  componentDidMount() {
    buildGraphcoolProvider({
      clientOptions: { uri: "http://localhost:5000/graphql" }
    }).then(dataProvider => this.setState({ dataProvider }));
  }

  render() {
    const { dataProvider } = this.state;

    if (!dataProvider) {
      return <div>Loading</div>;
    }

    return (
      <Admin dataProvider={dataProvider}>
        <Resource name="chapter" list={ListGuesser} />
        <Resource name="character" list={ListGuesser} />
        <Resource name="work" list={ListGuesser} />
        <Resource name="paragraph" list={ListGuesser} />
      </Admin>
    );
  }
}

export default App;
