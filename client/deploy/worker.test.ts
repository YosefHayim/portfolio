import { describe, expect, it } from 'vitest';
import { redirectDestination } from './worker';

describe('canonical domain redirects', () => {
  const hosts = [
    'yosefhayimsabag.com',
    'www.yosefhayimsabag.com',
    'yosefhayimsabag.dev',
    'www.yosefhayimsabag.dev',
    'www.joseph-tech-solutions.dev',
  ];
  it.each(hosts)('preserves path and query from %s', (host) => {
    const destination = redirectDestination(`http://${host}/v4/old%20page?ref=a%2Bb&lang=he`);
    expect(destination).toBe('https://joseph-tech-solutions.dev/v4/old%20page?ref=a%2Bb&lang=he');
  });
  it('upgrades canonical HTTP and avoids loops', () => {
    expect(redirectDestination('http://joseph-tech-solutions.dev/?from=link')).toBe(
      'https://joseph-tech-solutions.dev/?from=link',
    );
    expect(redirectDestination('https://joseph-tech-solutions.dev/')).toBeNull();
  });
  it('allows local previews and does not redirect arbitrary hosts', () => {
    expect(redirectDestination('http://localhost:4173/')).toBeNull();
    expect(redirectDestination('https://yosefhayimsabag.com.attacker.test/')).toBeNull();
  });
});
