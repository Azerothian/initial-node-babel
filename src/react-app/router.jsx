import React from "react";
import { render } from "react-dom";
import { Router, Route, Link, browserHistory } from "react-router";

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
        <label><input ref="email" placeholder="email" defaultValue="joe@example.com" /></label>
        <label><input ref="pass" placeholder="password" /></label> (hint: password1)<br />
        <button type="submit">login</button>
        {this.state.error && (
          <p>Bad login information</p>
        )}
      </form>
    );
  },
});
const App = React.createClass({
  getInitialState() {
    return {
      loggedIn: false, // auth.loggedIn()
    };
  },

  updateAuth(loggedIn) {
    this.setState({
      loggedIn: loggedIn,
    });
  },

  componentWillMount() {
    // auth.onChange = this.updateAuth;
    // auth.login();
  },

  render() {
    return (
      <div>
        <ul>
          <li>
            {this.state.loggedIn ? (
              <Link to="/logout">Log out</Link>
            ) : (
              <Link to="/login">Sign in</Link>
            )}
          </li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/dashboard">Dashboard</Link> (authenticated)</li>
        </ul>
        {this.props.children || <p>You are {!this.state.loggedIn && "not"} logged in.</p>}
      </div>
    );
  },
});

export default (<Router history={browserHistory}>
  <Route path="/" component={App}>
    <Route path="login" component={Login}/>
  </Route>
</Router>);
