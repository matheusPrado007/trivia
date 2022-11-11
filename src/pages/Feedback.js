import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Feedback extends React.Component {
  render() {
    const { asserts } = this.props;
    const MIN_ANSWERS = 3;
    return (
      <>
        <Header />
        { asserts < MIN_ANSWERS
          ? <p data-testid="feedback-text">Could be better...</p>
          : <p data-testid="feedback-text">Well Done!</p>}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  asserts: state.player.assertions,
});

Feedback.propTypes = {
  asserts: PropTypes.number,
}.isRequired;

export default connect(mapStateToProps)(Feedback);
