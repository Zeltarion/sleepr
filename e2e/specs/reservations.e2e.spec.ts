describe('Reservations', () => {
  let jwt: string;

  beforeAll(async () => {
    const user = {
      email: 'ownsleeprnestapp@gmail.com',
      password: 'Password123!',
    };

    await fetch('http://auth:3001/auth/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });

    jwt = await response.text(); // присваиваем в общую переменную
    console.log('JWT is: ', jwt);
  });

  test('Create', async () => {
    const createdReservation = await createReservation();
    const responseGet = await fetch(`http://reservations:3000/reservations/${createdReservation._id}`, {
      method: 'GET',
      headers: {
        Authentication: jwt,
      },
    })
    const reservation = await responseGet.json();
    expect(createdReservation).toEqual(reservation);
  });

  const createReservation = async () => {
    const responseCreate = await fetch('http://reservations:3000/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: jwt,
      },
      body: JSON.stringify({
        startDate: '12/20/2022',
        endDate: '12/25/2022',
        placeId: '12345',
        charge: {
          amount: 19,
          card: {
            cvc: '413',
            exp_month: 12,
            exp_year: 2027,
            number: '4242424242424242',
          },
        },
      }),
    });

    expect(responseCreate.ok).toBeTruthy();
    return responseCreate.json();
  }
});
