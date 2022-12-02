import Config from 'react-native-config';

export type AuthData = {
  token: string;
  token_type: string;
  token_info: TokenInfo;
};

export type TokenInfo = {
  user_id: string;
  email: string;
  name: string;
  trust_score: string;
  suspended: boolean;
  wallet_id: string;
};

// Returns undefined promise if login is unsuccessful
const signIn = (
  email: string,
  _password: string,
): Promise<AuthData | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      fetch(`${Config.API_URL}:8000/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            email: email,
            password: _password,
          },
          null,
          2,
        ),
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Invalid Login Credentials');
          }
          return res.json();
        })
        .then(data => {
          fetch(`${Config.API_URL}:8000/api/user`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data['access_token']}`,
            },
          })
            .then(res => {
              if (!res.ok) {
                throw new Error('Fetching user data failed');
              }
              return res.json();
            })
            .then(data_ => {
              resolve({
                token: data['access_token'],
                token_type: data['token_type'],
                token_info: {
                  user_id: data_['user_id'],
                  email: data_['email'],
                  name: data_['name'],
                  trust_score: data_['trust_score'],
                  suspended: data_['suspended'],
                  wallet_id: data_['walled_id'],
                },
              });
            })
            .catch(error => {
              console.log(error);
              resolve(undefined);
            });
        })
        .catch(error => {
          console.log(error);
          resolve(undefined);
        });
    }, 1000);
  });
};

export const authService = {
  signIn,
};
