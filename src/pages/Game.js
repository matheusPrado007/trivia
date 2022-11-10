import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';

class Game extends React.Component {
  state = {
    response: '',
    results: [],
    answers: [],
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    this.fetchQuestions(token);
  }

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
    const { results, answers } = this.state;
    return (
      <>
        <Header />
        <div>
          { results.length > 0 && (
            <div>
              <p data-testid="question-category">{ results[0].category }</p>
              <p data-testid="question-text">{ results[0].question }</p>
              <p>
                { answers.map((result, index = 0) => (
                  <button
                    key={ result }
                    type="button"
                    data-testid="answer-options"
                  >
                    {
                      result !== results[0]
                        .correct_answer
                        ? (
                          <p data-testid={ `wrong-answer-${index}` }>
                            { result }
                          </p>
                        )
                        : (<p data-testid="correct-answer">{ result }</p>)
                    }
                  </button>
                )) }
              </p>
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
