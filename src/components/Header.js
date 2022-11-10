import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';

class Header extends Component {
  state = {
    linkImagem: '',
  };

  componentDidMount() {
    const { email } = this.props;
    const hashGerada = md5(email).toString();
    const linkImagem = `https://www.gravatar.com/avatar/${hashGerada}`;
    this.setState({ linkImagem });
  }

  render() {
    const { linkImagem } = this.state;
    const { name, score } = this.props;
    return (
      <header>
        <img
          data-testid="header-profile-picture"
          src={ linkImagem }
          alt="Imagem do jogador"
        />
        <p data-testid="header-player-name">{ name }</p>
        <p data-testid="header-score">{ score }</p>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.player.name,
  email: state.player.gravatarEmail,
  score: state.player.score,
});

Header.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Header);
