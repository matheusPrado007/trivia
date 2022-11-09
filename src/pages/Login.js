import React, { Component } from 'react';
import fetchToken from '../services/api';

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
    const { history } = this.props;
    const tokenApi = await fetchToken();
    const { token } = tokenApi;
    localStorage.setItem('token', token);
    history.push('/game');
  }

  render() {
    const { name, email } = this.state;
    return (
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
    );
  }
}

export default Login;
