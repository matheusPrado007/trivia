import React from 'react';
import { act } from 'react-dom/test-utils';
import { getAllByAltText, getAllByRole, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from '../App';

describe('Pagina de RANKING', () => {
  
  test('1 - Verificar se aparece na tela os jogadores Carregando Jogadores caso não haja nenhum', () => {
    const { history } = renderWithRouterAndRedux(<App />);
  
    act(() => { history.push('/ranking') })
    expect(history.location.pathname).toBe('/ranking');
    expect(screen.getByText('Carregando Jogadores...')).toBeInTheDocument();
  });

 test('2 - Verificar se aparece na tela os jogadores e o botao homepage e ele redireciona para /', () => {
  const { history } = renderWithRouterAndRedux(<App />);

    const PLAYERS = [{
      name: 'joao',
      score: '100',
      gravatarEmail: '',
    }, {
      name: 'maria',
      score: '200',
      gravatarEmail: '',
    }, {
      name: 'cesar',
      score: '150',
      gravatarEmail: '',
    }
  ]
  
  
  localStorage.setItem('players', JSON.stringify(PLAYERS));  
  
  act(() => { history.push('/ranking') })
  expect(history.location.pathname).toBe('/ranking');
  
  const rank = screen.getByText('Ranking')
  expect(rank).toBeInTheDocument();

  const playerOneScreen = screen.getByText('joao')
  expect(playerOneScreen).toBeInTheDocument();

  const scoreScreen = screen.getByText('100')
  expect(scoreScreen).toBeInTheDocument();

  const dataPlayer = screen.getByTestId('player-name-0')
  expect(dataPlayer).toBeInTheDocument();
  
  const dataPlayer1 = screen.getByTestId('player-name-1')
  expect(dataPlayer1).toBeInTheDocument();
    
  const dataScore = screen.getByTestId('player-score-0')
  expect(dataScore).toBeInTheDocument();

  const dataScore1 = screen.getByTestId('player-score-1')
  expect(dataScore1).toBeInTheDocument();

  expect(screen.getAllByAltText('Imagem do jogador')).toHaveLength(3);
  expect(screen.getAllByAltText('Imagem do jogador')[0]).toBeInTheDocument();

  const btnHomePage= screen.getByRole('button', { name: /Homepage/i });
  userEvent.click(btnHomePage)
  expect(history.location.pathname).toBe('/');
});
});
