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
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ this.handleBtn }
        >
          Homepage
        </button>
      </div>
    );
  }
}

Ranking.propTypes = {
  push: PropTypes.func,
}.isRequired;

export default Ranking;
