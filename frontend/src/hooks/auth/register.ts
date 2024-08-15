async function useRegisterUser(userData: {
  name: string;
  email: string;
}): Promise<void> {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
    } else {
      console.error('Failed to register user');
    }
  } catch (error) {
    console.error('An error occurred while registering user:', error);
  }
}
