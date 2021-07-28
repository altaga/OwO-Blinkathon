// Basic
import { Component } from "react";

// Router
import {
  Router,
  Route,
  Switch
} from "react-router-dom";

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import Login from "./pages/login";
import Register from "./pages/register";
import Index from "./pages/main"
import MainParent from "./pages/main-parent";
import MainKid from "./pages/main-kid";
import history from "./utils/history";
import Desktop from "./pages/desktop";

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/main" component={MainParent} />
            <Route exact path="/main-kid" component={MainKid} />
            <Route exact path="/desktop" component={Desktop} />
            <Route path="*" component={Index} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
