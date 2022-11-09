import { LOGIN_INICIAL } from '../actions/index';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
};

const player = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case LOGIN_INICIAL:
    return ({ ...state,
      name: action.payload.name,
      gravatarEmail: action.payload.email,
    });
  default:
    return state;
  }
};

export default player;
