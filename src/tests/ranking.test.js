import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from '../App';
import store from '../redux/store';

describe('Pagina de Login', () => {
  test('1 - Verificar se aparece na tela botao VER RANKING e ele redireciona para /ranking', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    localStorage.setItem('players', 100)
    console.log(localStorage.getItem('players'))
    act(() => {
      history.push('/ranking');
    });

    const ranking = screen.getByText(/ranking/i)
    expect(ranking).toBeInTheDocument();
 });
});
