/**
 * Unit test for classNames function.
 * @file This file is saved as `classNames.test.js`.
 */
import '@testing-library/jest-dom';

import classNames from '../classNames';

describe('classNames unit test', () => {
  it('testing classNames in case of single class', () => {
    const classes = ['a'];
    const res = classNames(...classes);
    expect(res).toStrictEqual('a');
  });

  it('testing classNames in case of multiple classes', () => {
    const classes = ['a', 'a', 'b', {}];
    const res = classNames(...classes);
    expect(res).toStrictEqual('a a b');
  });

  it('testing classNames in case of multiple classes', () => {
    const classes = ['a', 'a', 'b'];
    const res = classNames(classes);
    expect(res).toStrictEqual('a a b');
  });

  it('testing classNames in case of multiple classes when one class has true condition', () => {
    const classes = ['a', { b: true }];
    const res = classNames(...classes);
    expect(res).toStrictEqual('a b');
  });

  it('testing classNames in case of multiple classes when one class has true condition', () => {
    const classes = ['a', { b: false }];
    const res = classNames(...classes);
    expect(res).toStrictEqual('a');
  });
});
