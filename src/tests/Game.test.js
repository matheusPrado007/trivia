import React from 'react';
import { act } from 'react-dom/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from '../App';
import { questionsResponse, invalidTokenQuestionsResponse, tokenResponse } from './helpers/mocks';

describe('Pagina de Login', () => {
  test('1 - Verificar se aparece na tela botao VER RANKING e ele redireciona para /ranking', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => tokenResponse
    }));

    const { history } = renderWithRouterAndRedux(<App />);

    expect(history.location.pathname).toBe('/');

    const inputPlayerName = screen.getByPlaceholderText('Qual é o seu nome?');
    userEvent.type(inputPlayerName, 'Joaozinho');
    expect(inputPlayerName).toHaveValue('Joaozinho');
    
    const inputEmail = screen.getByPlaceholderText('Qual é o seu e-mail do gravatar?');
    userEvent.type(inputEmail, 'Joaozinho@trybe.com');
    expect(inputEmail).toHaveValue('Joaozinho@trybe.com');

    const btnPlay = screen.getByRole('button', { name: /Play/i });
    expect(btnPlay).toBeInTheDocument();
  
    userEvent.click(btnPlay);

    await waitFor (() => expect(history.location.pathname).toBe('/game'), { timeout: 4000 });

    const namePlayer = screen.getByText('Joaozinho');
    expect(namePlayer).toBeInTheDocument();

    const scorePlayer = screen.getByText('0');
    expect(scorePlayer).toBeInTheDocument();
    
  });
  test('2 - Verificar se aparece na tela os botões das perguntas ao entrar na página de Game', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => questionsResponse
    }));

    const { history } = renderWithRouterAndRedux(<App />);

    act(() => {
      history.push('/game');
    });

    expect(history.location.pathname).toBe('/game');

    await waitFor (()=> expect(screen.getByTestId('correct-answer')).toBeInTheDocument(), { timeout: 1000 });
    
    const correct = screen.getByTestId('correct-answer');
    expect(correct).toHaveTextContent('False');

    const wrongQuestions = screen.getAllByTestId(/wrong-answer/);
    expect(wrongQuestions).toHaveLength(1);
    expect(wrongQuestions[0]).toHaveTextContent('True');
    
    const notBtnNext = screen.queryByRole('button', { name: 'Next' });
    expect(notBtnNext).toBeNull();

    userEvent.click(correct);

    const correctBtnStyle = window.getComputedStyle(correct);
    expect(correctBtnStyle.border).toBe('3px solid');
    expect(correctBtnStyle['border-color']).toBe('rgb(6, 240, 15)');
    
    const wrongBtnStyle = window.getComputedStyle(wrongQuestions[0]);
    expect(wrongBtnStyle.border).toBe('3px solid');
    expect(wrongBtnStyle['border-color']).toBe('red');

    const btnNext = screen.queryByRole('button', { name: 'Next' });
    expect(btnNext).toBeInTheDocument();

  });

  test('3 - Verificar se a tela do game volta para a página inicial caso a resposta da API for inválida', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => invalidTokenQuestionsResponse
    }));
    
    const { history } = renderWithRouterAndRedux(<App />);
    const historyPush = jest.spyOn(history, 'push');

    act(() => {
      history.push('/game');
    });
    
    await waitFor (() => expect(historyPush).toHaveBeenCalledWith('/'), { timeout: 4000 });
  });

  test('4 - Verificar se o botão Next redireciona para a página de feedback após o fim das perguntas', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => questionsResponse
    }));
    
    const questions = questionsResponse.results;

    const { history } = renderWithRouterAndRedux(<App />);

    act(() => {
      history.push('/game');
    });
    
    questions.forEach(async (question) => {
      const correctAnswer = await screen.findByTestId('correct-answer');
      userEvent.click(correctAnswer);
      userEvent.click(screen.getByText('Next'));
    });

    await waitFor (() => expect(history.location.pathname).toBe('/feedback'), { timeout: 4000 });
  });

  test('5 - Verificar se a soma de pontos está correta e se botão Next redireciona para a página de feedback após o fim das perguntas', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => questionsResponse
    }));
    
    const { history, store } = renderWithRouterAndRedux(<App />);

    act(() => {
      history.push('/game');
    });

    let score = 0;

    userEvent.click(await screen.findByTestId('correct-answer'));
    const questionOneText = await screen.findByTestId('question-text');
    const questionOneDificulty = questionsResponse.results.find((question) => (
      question.question === questionOneText.innerHTML
    )).difficulty;
    let newScore = questionOneDificulty === 'easy' && 40;
    score += newScore;
    expect(screen.getByTestId('header-score').innerHTML).toBe(String(score));
    userEvent.click(await screen.findByTestId('btn-next'));

    userEvent.click(await screen.findByTestId('correct-answer'));
    const questionTwoText = await screen.findByTestId('question-text');
    const questionTwoDificulty = questionsResponse.results.find((question) => (
      question.question === questionTwoText.innerHTML
    )).difficulty;
    newScore = questionTwoDificulty === 'hard' && 100;
    score += newScore;
    expect(screen.getByTestId('header-score').innerHTML).toBe(String(score));
    userEvent.click(await screen.findByTestId('btn-next'));

    userEvent.click(await screen.findByTestId('correct-answer'));
    const questionThreeText = await screen.findByTestId('question-text');
    const questionThreeDificulty = questionsResponse.results.find((question) => (
      question.question === questionThreeText.innerHTML
    )).difficulty;
    newScore = questionThreeDificulty === 'medium' && 70;
    score += newScore;
    expect(screen.getByTestId('header-score').innerHTML).toBe(String(score));
    userEvent.click(await screen.findByTestId('btn-next'));

    userEvent.click(await screen.findByTestId('correct-answer'));
    userEvent.click(await screen.findByTestId('btn-next'));

    userEvent.click(await screen.findByTestId('correct-answer'));
    userEvent.click(await screen.findByTestId('btn-next'));
  
    const storeScore = String(store.getState().player.score);
    expect(screen.getByTestId('header-score').innerHTML).toBe(storeScore);

    await waitFor (() => expect(history.location.pathname).toBe('/feedback'), { timeout: 4000 });
  });

  test('6 - Verificar se o timer está atualizando a cada 1 segundo, se após o clique na resposta o timer para de contar o tempo e se ele reseta ao clicar em next', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => questionsResponse
    }));
    
    const { history } = renderWithRouterAndRedux(<App />);

    act(() => {
      history.push('/game');
    });

    expect(await screen.findByText('30')).toBeInTheDocument();
    await waitFor (() => expect(screen.getByText('29')).toBeInTheDocument(), { timeout: 1000 });

    userEvent.click(await screen.findByTestId('correct-answer'));
    await waitFor (() => expect(screen.getByText('29')).toBeInTheDocument(), { timeout: 2000 });

    userEvent.click(await screen.findByTestId('btn-next'));
    expect(await screen.findByText('30')).toBeInTheDocument();
  });

  test('7 - Verificar se o timer zera e deixa os botões de resposta desabilitados', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => questionsResponse
    }));
    
    const { history } = renderWithRouterAndRedux(<App />);

    act(() => {
      history.push('/game');
    });

    userEvent.click(await screen.findByTestId('correct-answer'));
    userEvent.click(await screen.findByTestId('btn-next'));

    await waitFor (() => expect(screen.getByText('0')).toBeInTheDocument(), { timeout: 32000 });

    await waitFor (() => expect(screen.getByTestId('correct-answer')).toBeDisabled(), { timeout: 2000 });
  }, 40000);

  test('8 - Verificar se são geradas as quantidades corretas de botão de resposta', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => questionsResponse
    }));
    
    const { history } = renderWithRouterAndRedux(<App />);

    act(() => {
      history.push('/game');
    });

    expect(await screen.findAllByRole('button')).toHaveLength(2);
    expect(screen.queryByTestId('btn-next')).toBeNull();
    userEvent.click(await screen.findByTestId('correct-answer'));
    expect(screen.queryByTestId('btn-next')).toBeInTheDocument();

    userEvent.click(await screen.findByTestId('btn-next'));

    expect(await screen.findAllByRole('button')).toHaveLength(4);

  });

  test('9 - Verificar se são geradas as quantidades corretas de botão de resposta', async () => {
    global.fetch = jest.fn(async () => ({
      json: async () => questionsResponse
    }));

    const { history } = renderWithRouterAndRedux(<App />);

    act(() => {
      history.push('/game');
    });

    const loading = screen.getByText('Carregando Perguntas...');
    expect(loading).toBeInTheDocument();

  });
});