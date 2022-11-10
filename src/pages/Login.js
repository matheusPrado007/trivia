import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import fetchToken from '../services/api';
import { actionCreator, LOGIN_INICIAL } from '../redux/actions';
import SettingsBTN from '../components/SettingsBTN';

class Login extends Component {
  state = {
    name: '',
    email: '',
  };

  handleChange = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    });
  };

  btnChange = async () => {
    const { history, dispatch } = this.props;
    const tokenApi = await fetchToken();
    const { token } = tokenApi;
    localStorage.setItem('token', token);
    dispatch(actionCreator(LOGIN_INICIAL, this.state));
    history.push('/game');
  };

  render() {
    const { name, email } = this.state;
    return (
      <>
        <form>
          <input
            name="name"
            type="text"
            data-testid="input-player-name"
            onChange={ this.handleChange }
          />
          <input
            name="email"
            type="email"
            data-testid="input-gravatar-email"
            onChange={ this.handleChange }
          />
          <button
            type="button"
            data-testid="btn-play"
            disabled={ !(name && email) }
            onClick={ this.btnChange }
          >
            Play
          </button>
        </form>
        <Link to="/settings">
          <SettingsBTN />
        </Link>
      </>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  dispatch: PropTypes.func,
}.isRequired;

export default connect(null)(Login);
