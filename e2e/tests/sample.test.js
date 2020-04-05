import { Selector } from 'testcafe';

const TEST_URL = process.env.TEST_ENV_URL;

fixture('/login').page(`${TEST_URL}`);

test(`users should be able to log in and out`, async (t) => {

  // selectors
  const loginMessage = Selector('div').withText(
    'You successfully logged in! Welcome!')
  const logoutMessage = Selector('div').withText('You are now logged out')

  // login
  await t
    .navigateTo(`${TEST_URL}`)
    .typeText('input[name="username"]', 'michael')
    .typeText('input[name="password"]', 'herman')
    .click(Selector('button[type="submit"]'));

  // logout
  await t
    .expect(loginMessage.exists).ok()
    .click(Selector('a').withText('Logout'))
    .expect(logoutMessage.exists).ok()

});
