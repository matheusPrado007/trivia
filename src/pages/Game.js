import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Game extends React.Component {
  state = {
    response: '',
    results: [],
    answers: [],
    timer: 30,
    intervalID: '',
    answerDisabled: false,
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    this.fetchQuestions(token);
    const interval = 1000;
    const intervalID = setInterval(this.timerAtualiza, interval);
    this.setState({
      intervalID,
    });
  }

  endInterval = () => {
    const { timer, intervalID } = this.state;
    if (timer === 0) {
      clearInterval(intervalID);
      this.setState({
        answerDisabled: true,
      });
    }
  };

  timerAtualiza = () => {
    const { timer } = this.state;
    this.setState({
      timer: timer - 1,
    }, () => { this.endInterval(); });
  };

  fetchQuestions = async (token) => {
    const { history: { push } } = this.props;
    const request = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    const data = await request.json();
    this.setState({
      response: data.response_code,
      results: data.results,
    }, () => {
      const { response, results } = this.state;
      if (response !== 0) {
        localStorage.clear('token');
        push('/');
      } else {
        const answersList = [
          ...data.results[0].incorrect_answers, data.results[0].correct_answer,
        ];
        const randomAux = 0.5;
        const randomAnswers = answersList.sort(() => Math.random() - randomAux);
        this.setState({ answers: randomAnswers });
      } return results;
    });
  };

  render() {
    const { results, answers, timer, answerDisabled } = this.state;
    return (
      <>
        <Header />
        <div>
          { results.length > 0 && (
            <div>
              <h1>Timer</h1>
              <p>{ timer }</p>
              <p data-testid="question-category">{ results[0].category }</p>
              <p data-testid="question-text">{ results[0].question }</p>
              <div data-testid="answer-options">
                { answers.map((result, index = 0) => (

                  result !== results[0]
                    .correct_answer
                    ? (
                      <button
                        key={ index }
                        type="button"
                        data-testid={ `wrong-answer-${index}` }
                        disabled={ answerDisabled }
                      >
                        { result }
                      </button>
                    )
                    : (
                      <button
                        key={ index }
                        type="button"
                        data-testid="correct-answer"
                        disabled={ answerDisabled }
                      >
                        { result }
                        {' '}
                      </button>)
                )) }
              </div>
            </div>
          ) }
        </div>
      </>
    );
  }
}

Game.propTypes = {
  push: PropTypes.func,
}.isRequired;

export default connect(null)(Game);
