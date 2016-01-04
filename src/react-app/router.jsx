import React from "react";
//import {render} from "react-dom";
import {Router, Route, Link, browserHistory} from "react-router";



const Login = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      error: false,
    };
  },

  handleSubmit(event) {
    event.preventDefault();

    //const email = this.refs.email.value
    // auth.login(email, pass, (loggedIn) => {
    //   if (!loggedIn) {
    //     return this.setState({ error: true });
    //   }
    //   const {location} = this.props;
    //   if (location.state && location.state.nextPathname) {
    //     this.context.router.replace(location.state.nextPathname);
    //   } else {
    //     this.context.router.replace("/");
    //   }
    // });
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input defaultValue="joe@example.com"
            placeholder="email"
            ref="txtEmail"
          />
        </label>
        <label>
          <input
            placeholder="password"
            ref="txtPassword"
          />
        </label>
        {"(hint: password1)"}<br />
        <button type="submit">{"login"}</button>
        {this.state.error && (
          <p>{"Bad login information"}</p>
        )}
      </form>
    );
  },
});
const App = React.createClass({
  displayName: "App",
  propTypes: {
    children: React.PropTypes.func,
  },
  getInitialState() {
    return {
      loggedIn: false, // auth.loggedIn()
    };
  },


  componentWillMount() {
    // auth.onChange = this.updateAuth;
    // auth.login();
  },
  updateAuth(loggedIn) {
    this.setState({
      loggedIn: loggedIn,
    });
  },
  render() {
    return (
      <div>
        <ul>
          <li>
            {this.state.loggedIn ? (
              <Link to="/logout">{"Log out"}</Link>
            ) : (
              <Link to="/login">{"Sign in"}</Link>
            )}
          </li>
          <li><Link to="/about">{"About"}</Link></li>
          <li><Link to="/dashboard">{"Dashboard"}</Link>{" (authenticated)"}</li>
        </ul>
        {this.props.children || <p>{"You are "}{!this.state.loggedIn && "not"}{" logged in."}</p>}
      </div>
    );
  },
});

export default (React.createClass({
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={App}
          path="/"
        >
          <Route component={Login}
            path="login"
          />
        </Route>
      </Router>
    );
  },
}));
