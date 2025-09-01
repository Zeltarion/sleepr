describe('Health', () => {
  test('Reservations', async () => {
    await new Promise((r) => setTimeout(r, 3000));
    const response = await fetch('http://reservations:3000/reservations/health');
    expect(response.ok).toBeTruthy();
  });
});
