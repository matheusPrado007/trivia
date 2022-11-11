import React from 'react';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import { actionCreator, CLEAR_SCORE } from '../redux/actions';

class Ranking extends React.Component {
  state = {
    players: [],
  };

  componentDidMount() {
    const players = JSON.parse(localStorage.getItem('players'));
    const order = players.sort((a, b) => b.score - a.score);
    this.setState({ players: order });
  }

  handleBtn = () => {
    const { dispatch, history: { push } } = this.props;
    dispatch(actionCreator(CLEAR_SCORE));
    push('/');
  };

  render() {
    const { players } = this.state;
    return (
      <div>
        <h1 data-testid="ranking-title">Ranking</h1>
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ this.handleBtn }
        >
          Homepage
        </button>
        <button
          type="button"
          data-testid="btn-play-again"
          onClick={ this.handleBtn }
        >
          Play Again
        </button>
        { players.map((info, index = 0) => (
          <div key={ index }>
            <p
              data-testid={ `player-name-${index}` }
            >
              { info.name }
            </p>
            <p
              data-testid={ `player-score-${index}` }
            >
              { info.score }
            </p>
            <img
              alt="Imagem do jogador"
              src={ `https://www.gravatar.com/avatar/${md5(info.gravatarEmail).toString()}` }
            />
          </div>))}
      </div>
    );
  }
}

Ranking.propTypes = {
  push: PropTypes.func,
}.isRequired;

export default connect(null)(Ranking);
