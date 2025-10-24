// In a real application, this data would come from a database.
// Passwords should NEVER be stored in plaintext.

export const mockUsers = {
  'admin': {
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  'user': {
    password: 'user123',
    role: 'user',
    name: 'Common User'
  }
};
