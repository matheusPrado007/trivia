import React from 'react';
import PropTypes from 'prop-types';

class Ranking extends React.Component {
  handleBtn = () => {
    const { history: { push } } = this.props;
    push('/');
  };

  render() {
    return (
      <div>
        <h1 data-testid="ranking-title">Ranking</h1>
        {/* <button
          type="button"
          data-testid="btn-go-home"
          onClick={ this.handleBtn }
        >
          Homepage
        </button> */}
        <button
          type="button"
          data-testid="btn-play-again"
          onClick={ this.handleBtn }
        >
          Play Again
        </button>
      </div>
    );
  }
}

Ranking.propTypes = {
  push: PropTypes.func,
}.isRequired;

export default Ranking;
