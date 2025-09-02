describe('Reservations', () => {
  beforeAll(async () => {
    const user = {
      email: 'ownsleeprnestapp@gmail.com',
      password: 'Password123!',
    };
    await fetch('http://auth:3001/auth/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });

    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
    });

    const jwt = await response.text();
    console.log('JWT is: ', jwt);
  });

  test('Create', () => {
    expect(true).toBeTruthy();
  });
});
