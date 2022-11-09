const URL = 'https://opentdb.com/api_token.php?command=request';

const fetchToken = async () => {
  const res = await fetch(URL);
  const data = await res.json();
  return data;
};

export default fetchToken;
