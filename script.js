'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/**
 *
 * BILANS KONTA
 *
 */
const calcAndDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

/**
 *
 * IN, OUT and INTEREST obliczanie
 *
 */
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

/**
 *
 *
 *
 */
const calcAndPrintBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} €`;
};

const createUserNames = function (accs) {
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};
createUserNames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcAndDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// EVENT HANDLER
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // PRevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome mess
    labelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movemant
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //Delete User
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;

    // Reset póla
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
// NEXTLESSON
let arr = ['a', 'b', 'c', 'd', 'e'];


// SLICE method
console.log(arr.slice(2)); // zaczuna od pozycji 2 i leci do końca
console.log(arr.slice(2, 4)); // zaczyna od pozycji 2 i kończy przed pozycją nr 4 czyli na 3 (DZIWNE)
console.log(arr.slice(-2)); // zaczyna od końca i daje dwa elementy
console.log(arr.slice(-1)); // zawsze ostatni element
console.log(arr.slice(1, -2)); // zaczyna od pozycji 1 do końca z wykluczeniem dwuch ostatnich pozycji
console.log(arr.slice());
console.log([...arr]);

// SPLICE method
// SPLICE od SLICE różni się tym że SPLICE zmienia nam początkową tablicę !!!!!
// console.log(arr.splice(2));
console.log('------------------------------'); // SEPARATOR
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE
// Zienia początkową tablicę !!!!!
console.log('------------------------------'); // SEPARATOR

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
//  NIE zienia początkową tablicę
console.log('------------------------------'); // SEPARATOR

const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log('------------------------------'); // SEPARATOR

console.log(letters.join(' - '));

//NEXTLESSON

const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('Lech'.at(0));
console.log('Lech'.at(-1));

//NEXTLESSON

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${Math.abs(movement)}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${-Math.abs(movement)}`);
  }
}

console.log('-------FOREACH-------'); // SEPARATOR

movements.forEach(function (mov, i, arr) {
  // mov - ZAWSZE PIERWSZY JEST ELEMENT
  // i - potem jest INDEX
  // arr - a na końcu jest tablica
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${Math.abs(mov)}`);
  } else {
    console.log(`Movement ${i + 1}: You deposited ${-Math.abs(mov)}`);
  }
});
// 0: function(200)
// 0: function(450)
// 0: function(400)
// ... i tak dalej 

//NEXTLESSON

// MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// SET
const currenciesUnique = new Set(['USD', 'EUR', 'GBP', 'EUR', 'USD']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});

//NEXTLESSON

const eurToUsd = 1.1;
// const movementUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
//   // return 23; // Zwraca nową tablicę tej zamej długości z samymi 23
// });

const movementUSD = movements.map(mov => mov * eurToUsd); // ta sama funkcja tylko za pomocą ARROWED

console.log(movements);
console.log(movementUSD);

const movementUSDfor = [];
for (const mov of movements) movementUSDfor.push(mov * eurToUsd);
console.log(movementUSDfor);

const movementsDescriptions = movements.map((mov, i) => {
  `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
    mov
  )}`;
});
console.log(movementsDescriptions);

//NEXTLESSON

const deposits = movements.filter(mov => mov > 0);
console.log(movements);
console.log(deposits);

const depositFor = [];
for (const mov of movements) if (mov > 0) depositFor.push(mov);
console.log(depositFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);


console.log(movements);

// accumulator is like a snowball
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0); // TO ZERO TO WARTOŚĆ POCZĄTKOWA CIĄGU !!!!!!!!!!!!!
// console.log(balance);

const balance = movements.reduce((acc, cur) => acc + cur, 0);

// To samo w pętli for of
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// Maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

//
// CHALLENGE No1
//

const chceckDogs = function (dogsKate, dogsJulia) {
  const dogsJuliaCorrent = dogsJulia.slice();
  dogsJuliaCorrent.splice(0, 1);
  dogsJuliaCorrent.splice(-2);
  console.log(dogsJuliaCorrent);

  const allDogs = dogsKate.concat(dogsJuliaCorrent);
  console.log(allDogs);

  allDogs.forEach(function (dog, i) {
    console.log(
      `Dog nr:${i + 1} i ${
        dog >= 3 ? `an adult, and is ${dog} years old` : 'is still a puppy 🐕'
      }`
    );
  });
};

chceckDogs([3, 5, 2, 12, 7], [9, 16, 6, 8, 3]);
chceckDogs([4, 1, 15, 8, 3], [10, 5, 6, 1, 4]);

// TEST DATA
// KATE [3,5,2,12,7], [4,1,15,8,3]
// JULIA [9,16,6,8,3], [10,5,6,1,4]

//
// CHALLENGE No1 KONIEC
//

//
// CHALLENGE No2
//

// TODO Trzeba by powtórki !!!

// const calcHumanAge = age => {
//   age <= 2 ? 2 * age : 16 + age * 4;
// };

const calcHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter(age => age >= 18);
  const avgAgeAdult = adults.reduce(
    (acc, age, i, arr) => acc + age / arr.length,
    0
  );
  console.log(adults);
  console.log(humanAges);
  console.log(avgAgeAdult);
};

calcHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcHumanAge([16, 6, 10, 5, 6, 1, 4]);

// TEST DATA
// [5, 2, 4, 1, 15, 8, 3]
// [16, 6, 10, 5, 6, 1, 4]

//
// CHALLENGE No2 KONIEC
//

const eurToUsd = 1.1;

// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    return mov * eurToUsd;
  })
  // .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);

//
// CHALLENGE No3
//

const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const avr1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log(avr1);
const avr2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avr2);
// TEST DATA
// [5, 2, 4, 1, 15, 8, 3]
// [16, 6, 10, 5, 6, 1, 4]

//
// CHALLENGE No3 KONIEC
//
// NEXTLESSON 

const firstWithgrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithgrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

// NEXTLESSON

console.log(movements);
// EQUALITY
console.log(movements.includes(-130));

// SOME: CONDITION
console.log(movements.some(mov => mov > -130));

console.log(movements.some(mov => mov > 1500));

// EVERY
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//NEXTLESSON
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat()); // = [1, 2, 3, 4, 5, 6, 7, 8]

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2)); // argument jak głęboko zadziała ta funkcja

// FLAT
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance);

// FLATMAP
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance2);

// NEXTLESSON
// Strings
const owners = ['Jonas', 'Zac', 'Ada,', 'Marta'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);

// return < 0 A, B (keep oreder)
// return > 0 B, A (switch oreder)

// Od najmieniszej do największe
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

movements.sort((a, b) => a - b); // krótsza wersja

// Od największej do najmniejszej
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });

movements.sort((a, b) => b - a); // krótsza wersja

console.log(movements);

// NEXTLESSON
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty arrays
const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5)); // Nie działa

// x.fill(1);
// x.fill(1, 3); // zaczyna wypełniać od 3 pozycji do końca
x.fill(1, 3, 5); // zaczyna wypełniać od 3 pozycji do 5 pozycji
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// ARRAY.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

// 100 X dice roll
const rollDice = Array.from(
  { length: 100 },
  (_, i) => Math.floor(Math.random(i) * 6) + 1
);
console.log(rollDice);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);
});

// NEXTLESSON
// POWTÓRKA

// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);

// 2.
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);

//Prefixed ++
let a = 10;
console.log(++a);
console.log(a);
// 3.

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4.
// This is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const expections = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      expections.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('This is a nice title'));
console.log(convertTitleCase('This is a LONG title but not to long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/
