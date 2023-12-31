import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { actionCreator, GET_ANSWER } from '../redux/actions';

class Game extends React.Component {
  state = {
    response: '',
    results: [],
    answers: [],
    timer: 30,
    intervalID: '',
    answerDisabled: false,
    check: false,
    questionOrder: 0,
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
        check: true,
      });
    }
  };

  timerAtualiza = () => {
    const { timer } = this.state;
    this.setState({
      timer: timer - 1,
    }, () => { this.endInterval(); });
  };

  responseValidation = () => {
    const { history: { push } } = this.props;
    const { response, results, questionOrder } = this.state;
    if (response !== 0) {
      localStorage.clear('token');
      push('/');
    } else {
      const answersList = [
        ...results[questionOrder].incorrect_answers,
        results[questionOrder].correct_answer,
      ];
      const randomAux = 0.5;
      const randomAnswers = answersList.sort(() => Math.random() - randomAux);
      this.setState({ answers: randomAnswers });
    } return results;
  };

  fetchQuestions = async (token) => {
    const request = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    const data = await request.json();
    this.setState({
      response: data.response_code,
      results: data.results,
    }, () => { this.responseValidation(); });
  };

  bonusMultiplier = (dificulty) => {
    const hardBonus = 3;
    const mediumBonus = 2;
    const easyBonus = 1;
    if (dificulty === 'hard') {
      return hardBonus;
    }
    if (dificulty === 'medium') {
      return mediumBonus;
    }
    return easyBonus;
  };

  addScore = (target) => {
    const { score, assertions, dispatch } = this.props;
    const { results, questionOrder, timer } = this.state;
    const { difficulty } = results[questionOrder];
    let payload = {
      score,
      assertions,
    };
    const difficultyMultiplier = this.bonusMultiplier(difficulty);
    if (target.className.includes('correct')) {
      const basePoints = 10;
      const newScore = score + (basePoints + (timer * difficultyMultiplier));
      payload = {
        score: newScore,
        assertions: assertions + 1,
      };
      dispatch(actionCreator(GET_ANSWER, payload));
    }
  };

  validateColor = (btn) => {
    if (btn.className.includes('wrong')) {
      btn.style.border = '3px solid';
      btn.style.borderColor = 'red';
    } else {
      btn.style.border = '3px solid';
      btn.style.borderColor = 'rgb(6, 240, 15)';
    }
  };

  ownColor = (target) => {
    const answerBtns = [...target.parentElement.children];
    answerBtns.forEach((btn) => {
      this.validateColor(btn);
    });
  };

  answerBtn = ({ target }) => {
    const { intervalID } = this.state;
    clearInterval(intervalID);
    this.setState({ check: true });
    this.ownColor(target);
    this.setState({ answerDisabled: true });
    this.addScore(target);
  };

  resetBorderAndTimer = () => {
    const btns = document.querySelectorAll('.answerBtn');
    btns.forEach((btn) => {
      btn.style.removeProperty('border');
      btn.style.removeProperty('borderColor');
    });
    const interval = 1000;
    const intervalID = setInterval(this.timerAtualiza, interval);
    this.setState({
      intervalID,
    });
  };

  saveResults = () => {
    const { score, name, gravatarEmail } = this.props;
    const playerInfo = { score, name, gravatarEmail };
    const storeInfo = JSON.parse(localStorage.getItem('players'));
    if (storeInfo !== null) {
      const newStoreInfo = JSON.stringify([...storeInfo, playerInfo]);
      localStorage.setItem('players', newStoreInfo);
    } else {
      localStorage.setItem('players', JSON.stringify([playerInfo]));
    }
  };

  handleNext = () => {
    const { questionOrder } = this.state;
    const { history: { push } } = this.props;
    const maxAnswer = 4;
    if (questionOrder < maxAnswer) {
      this.setState((prev) => ({
        questionOrder: prev.questionOrder + 1,
        check: false,
        answerDisabled: false,
        timer: 30,
      }), () => { this.responseValidation(); });
      this.resetBorderAndTimer();
    } else {
      this.saveResults();
      push('/feedback');
    }
  };

  render() {
    const { results, answers, timer, answerDisabled, check, questionOrder } = this.state;
    return (
      <div>
        <Header />
        <div>
          { results.length > 0 ? (
            <div>
              <h1>Timer</h1>
              <p>{ timer }</p>
              <p data-testid="question-category">{ results[questionOrder].category }</p>
              <p data-testid="question-text">{ results[questionOrder].question }</p>
              <div data-testid="answer-options">
                { answers.map((result, index) => (
                  result !== results[questionOrder]
                    .correct_answer
                    ? (
                      <button
                        key={ index }
                        type="button"
                        className="wrong-answer answerBtn"
                        data-testid={ `wrong-answer-${index}` }
                        disabled={ answerDisabled }
                        onClick={ this.answerBtn }
                      >
                        { result }
                      </button>
                    )
                    : (
                      <button
                        key={ index }
                        type="button"
                        className="correct-answer answerBtn"
                        data-testid="correct-answer"
                        disabled={ answerDisabled }
                        onClick={ this.answerBtn }
                      >
                        { result }
                      </button>)
                )) }
              </div>
              {check
                && (
                  <button
                    type="button"
                    data-testid="btn-next"
                    onClick={ this.handleNext }
                  >
                    Next
                  </button>
                )}
            </div>
          ) : <p>Carregando Perguntas...</p> }
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  push: PropTypes.func,
}.isRequired;

const mapStateToProps = (state) => ({
  score: state.player.score,
  assertions: state.player.assertions,
  gravatarEmail: state.player.gravatarEmail,
  name: state.player.name,
});

export default connect(mapStateToProps)(Game);
