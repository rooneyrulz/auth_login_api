const regexOfName = /^[a-zA-Z ]{2,30}$/;
const regexOfEmail = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;

export const validateEmptyFields = (
  firstName,
  lastName,
  age,
  email,
  username,
  password,
  cPassword
) => {
  // Validate for empty fields and null and undefined values
  if (
    firstName !== undefined &&
    firstName !== '' &&
    lastName !== undefined &&
    lastName !== '' &&
    age !== undefined &&
    email !== undefined &&
    email !== '' &&
    username !== undefined &&
    username !== '' &&
    password !== undefined &&
    password !== '' &&
    cPassword !== undefined &&
    cPassword !== ''
  ) {
    return true;
  }
  return false;
};

// Validating first name
export const validateFirstName = fName => regexOfName.test(fName);

// Validating last name
export const validateLastName = lName => regexOfName.test(lName);

// Validating age
export const validateAge = age => age < 100 && age > 1;

// Validating the both passwords
export const validatePassword = (password, cPassword) => password === cPassword;

// Validating email id
export const validateEmail = email => regexOfEmail.test(email);
