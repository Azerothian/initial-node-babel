"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Login = _react2.default.createClass({
  displayName: "Login",

  contextTypes: {
    router: _react2.default.PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      error: false
    };
  },
  handleSubmit: function handleSubmit(event) {
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
  render: function render() {
    return _react2.default.createElement(
      "form",
      { onSubmit: this.handleSubmit },
      _react2.default.createElement(
        "label",
        null,
        _react2.default.createElement("input", { defaultValue: "joe@example.com",
          placeholder: "email",
          ref: "txtEmail"
        })
      ),
      _react2.default.createElement(
        "label",
        null,
        _react2.default.createElement("input", {
          placeholder: "password",
          ref: "txtPassword"
        })
      ),
      "(hint: password1)",
      _react2.default.createElement("br", null),
      _react2.default.createElement(
        "button",
        { type: "submit" },
        "login"
      ),
      this.state.error && _react2.default.createElement(
        "p",
        null,
        "Bad login information"
      )
    );
  }
});
//import {render} from "react-dom";

var App = _react2.default.createClass({
  displayName: "App",
  propTypes: {
    children: _react2.default.PropTypes.func
  },
  getInitialState: function getInitialState() {
    return {
      loggedIn: false };
  },
  // auth.loggedIn()
  componentWillMount: function componentWillMount() {
    // auth.onChange = this.updateAuth;
    // auth.login();
  },
  updateAuth: function updateAuth(loggedIn) {
    this.setState({
      loggedIn: loggedIn
    });
  },
  render: function render() {
    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(
        "ul",
        null,
        _react2.default.createElement(
          "li",
          null,
          this.state.loggedIn ? _react2.default.createElement(
            _reactRouter.Link,
            { to: "/logout" },
            "Log out"
          ) : _react2.default.createElement(
            _reactRouter.Link,
            { to: "/login" },
            "Sign in"
          )
        ),
        _react2.default.createElement(
          "li",
          null,
          _react2.default.createElement(
            _reactRouter.Link,
            { to: "/about" },
            "About"
          )
        ),
        _react2.default.createElement(
          "li",
          null,
          _react2.default.createElement(
            _reactRouter.Link,
            { to: "/dashboard" },
            "Dashboard"
          ),
          " (authenticated)"
        )
      ),
      this.props.children || _react2.default.createElement(
        "p",
        null,
        "You are ",
        !this.state.loggedIn && "not",
        " logged in."
      )
    );
  }
});

exports.default = _react2.default.createClass({
  displayName: "router",
  render: function render() {
    return _react2.default.createElement(
      _reactRouter.Router,
      { history: _reactRouter.browserHistory },
      _react2.default.createElement(
        _reactRouter.Route,
        { component: App,
          path: "/"
        },
        _react2.default.createElement(_reactRouter.Route, { component: Login,
          path: "login"
        })
      )
    );
  }
});