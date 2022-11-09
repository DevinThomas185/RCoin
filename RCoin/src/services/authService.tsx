export type AuthData = {
  token: string;
  //   email: string;
  //   name: string;
};

// Returns undefined promise if login is unsuccessful
const signIn = (
  email: string,
  _password: string,
): Promise<AuthData | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      fetch('http://10.0.2.2:8000/api/login', {
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
          console.log(data);
          resolve({token: data['access_token']});
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
