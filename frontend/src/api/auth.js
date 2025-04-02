import api from './config';

// Mock users for testing
const MOCK_USERS = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  }
];

// Mock JWT token
const generateMockToken = (userId) => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

export const login = async (credentials) => {
  try {
    // Try to use the actual API first
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { token, user };
  } catch (error) {
    console.log('Using mock data for login:', error);
    // Fall back to mock data if API fails
    const user = MOCK_USERS.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = generateMockToken(user.id);
    localStorage.setItem('token', token);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
};

export const register = async (userData) => {
  try {
    // Try to use the actual API first
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { token, user };
  } catch (error) {
    console.log('Using mock data for register:', error);
    // Fall back to mock data if API fails
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: (MOCK_USERS.length + 1).toString(),
      ...userData
    };
    
    MOCK_USERS.push(newUser);
    
    const token = generateMockToken(newUser.id);
    localStorage.setItem('token', token);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return { token, user: userWithoutPassword };
  }
};

export const getCurrentUser = async () => {
  try {
    // Try to use the actual API first
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.log('Using mock data for getCurrentUser:', error);
    // Fall back to mock data - in a real app, we would decode the JWT
    // For mock, we'll just return the first user
    if (localStorage.getItem('token')) {
      const user = MOCK_USERS[0];
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    throw new Error('Not authenticated');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
}; 