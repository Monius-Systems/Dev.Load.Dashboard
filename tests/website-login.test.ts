import { test } from 'node:test';
import assert from 'node:assert/strict';
import { websiteLoginUrl } from '../lib/website-login.ts';

void test('signing out goes to the Client Login on the website', () => {
  assert.equal(websiteLoginUrl('http://127.0.0.1:4320/'), 'http://127.0.0.1:4320/login');
  assert.equal(websiteLoginUrl('https://monius.systems/'), 'https://monius.systems/login');
});

void test('a missing slash on the website address is not a problem', () => {
  assert.equal(websiteLoginUrl('https://monius.systems'), 'https://monius.systems/login');
  // A path on the website is kept, so a dashboard under a sub-path still works.
  assert.equal(websiteLoginUrl('https://monius.systems/clients/'), 'https://monius.systems/clients/login');
});

void test('without a website address the dashboard signs in on its own page', () => {
  assert.equal(websiteLoginUrl(null), '/login');
  assert.equal(websiteLoginUrl(undefined), '/login');
  assert.equal(websiteLoginUrl(''), '/login');
});

void test('only a real web address is followed', () => {
  assert.equal(websiteLoginUrl('not a url'), '/login');
  assert.equal(websiteLoginUrl('javascript:alert(1)'), '/login');
  assert.equal(websiteLoginUrl('file:///etc/passwd'), '/login');
});
