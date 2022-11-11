import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Feedback extends React.Component {
  playAgain = () => {
    const { history } = this.props;
    history.push('/');
  };

  ranking = () => {
    const { history } = this.props;
    history.push('/ranking');
  };

  render() {
    const { asserts, points } = this.props;
    const MIN_ANSWERS = 3;
    return (
      <>
        <Header />
        <h3 data-testid="feedback-total-question">{ asserts }</h3>
        <h3 data-testid="feedback-total-score">{ points }</h3>
        { asserts < MIN_ANSWERS
          ? <p data-testid="feedback-text">Could be better...</p>
          : <p data-testid="feedback-text">Well Done!</p>}
        <button
          type="button"
          data-testid="btn-ranking"
          onClick={ this.ranking }
        >
          Ver Ranking
        </button>
        <button
          type="button"
          data-testid="btn-play-again"
          onClick={ this.playAgain }
        >
          Play Again
        </button>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  asserts: state.player.assertions,
  points: state.player.score,
});

Feedback.propTypes = {
  asserts: PropTypes.number,
  points: PropTypes.number,
}.isRequired;

export default connect(mapStateToProps)(Feedback);
