import { GET_ANSWER, LOGIN_INICIAL } from '../actions/index';

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
  case (GET_ANSWER):
    return ({
      ...state,
      ...action.payload,
    });
  default:
    return state;
  }
};

export default player;
