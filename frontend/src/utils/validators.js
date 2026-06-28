export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const validatePassword = (password) =>
  password.length >= 6

export const validateSignup = ({ name, email, password }) => {
  const errors = {}
  if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
  if (!validateEmail(email)) errors.email = 'Enter a valid email'
  if (!validatePassword(password)) errors.password = 'Password must be at least 6 characters'
  return errors
}

export const validateLogin = ({ email, password }) => {
  const errors = {}
  if (!validateEmail(email)) errors.email = 'Enter a valid email'
  if (!password) errors.password = 'Password is required'
  return errors
}

export const validateItem = ({ name, price, category }) => {
  const errors = {}
  if (!name || name.trim().length < 2) errors.name = 'Item name is required'
  if (!price || isNaN(price) || Number(price) <= 0) errors.price = 'Enter a valid price'
  if (!category) errors.category = 'Select a category'
  return errors
}
