describe('Health', () => {
  test('Reservations', async () => {
    const response = await fetch('http://reservations:3000/reservations/health');
    expect(response.status).toBe(200);
  });

  test('Auth', async () => {
    const response = await fetch('http://auth:3001/auth/health');
    expect(response.status).toBe(200);
  });
});
