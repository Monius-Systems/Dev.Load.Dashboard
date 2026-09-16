import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fromWebsite,
  parseSignInForm,
  websiteLoginUrl,
} from '../lib/server/website-sign-in.ts';

const WEBSITE = 'https://moniussystems.example/';

void test('only the configured website may submit the sign-in form', () => {
  assert.equal(fromWebsite('https://moniussystems.example', WEBSITE), true);
  assert.equal(fromWebsite(null, WEBSITE), false);
  assert.equal(fromWebsite('null', WEBSITE), false);
  assert.equal(fromWebsite('https://evil.example', WEBSITE), false);
  assert.equal(fromWebsite('http://moniussystems.example', WEBSITE), false);
  assert.equal(fromWebsite('https://moniussystems.example.evil.example', WEBSITE), false);
  assert.equal(fromWebsite('https://moniussystems.example', 'not a url'), false);
});

void test('failures go back to the website Client Login with a code', () => {
  assert.equal(
    websiteLoginUrl(WEBSITE, 'failed'),
    'https://moniussystems.example/login?error=failed',
  );
  assert.equal(
    websiteLoginUrl('http://127.0.0.1:4320/', 'unavailable'),
    'http://127.0.0.1:4320/login?error=unavailable',
  );
});

void test('the form needs an email and a password within limits', () => {
  assert.deepEqual(parseSignInForm('email=%20dispatch%40adtrucking.example%20&password=p%26ss'), {
    email: 'dispatch@adtrucking.example',
    password: 'p&ss',
  });
  assert.equal(parseSignInForm('email=&password=secret'), null);
  assert.equal(parseSignInForm('email=a%40b.example'), null);
  assert.equal(parseSignInForm(`email=${'a'.repeat(255)}&password=x`), null);
  assert.equal(parseSignInForm(`email=a%40b.example&password=${'x'.repeat(1025)}`), null);
});
