import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Game extends React.Component {
  state = {
    response: '',
    results: [],
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    this.fetchQuestions(token);
  }

  fetchQuestions = async (token) => {
    const { history: { push } } = this.props;
    const request = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    const data = await request.json();
    console.log(data);
    this.setState({
      response: data.response_code,
      results: data.results,
    }, () => {
      const { response, results } = this.state;
      if (response !== 0) {
        localStorage.clear('token');
        push('/');
      } return results;
    });
  };

  render() {
    return (
            <Header />
    );
  }
}

Game.propTypes = {
  push: PropTypes.func,
}.isRequired;

export default connect(null)(Game);
