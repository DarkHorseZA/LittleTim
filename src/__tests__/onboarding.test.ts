import { firstRunRoute } from '../onboarding';

describe('firstRunRoute (onboarding before the account ask)', () => {
  it('shows onboarding first to a brand-new reader', () => {
    expect(firstRunRoute({})).toBe('HowToUse');
  });

  it('asks for the account only after onboarding has been seen', () => {
    expect(firstRunRoute({ hasSeenHowTo: true })).toBe('EmailSignup');
  });

  it('captures the first baseline once onboarding and account are done', () => {
    expect(
      firstRunRoute({ hasSeenHowTo: true, registeredEmail: 'a@b.co' })
    ).toBe('Tracker');
  });

  it('lands on Tabs once everything first-run is complete', () => {
    expect(
      firstRunRoute({
        hasSeenHowTo: true,
        registeredEmail: 'a@b.co',
        lastCheckInDate: '2026-01-01',
      })
    ).toBe('Tabs');
  });

  it('never asks for the account before onboarding, even if an email somehow exists', () => {
    // hasSeenHowTo is the first gate, so onboarding always leads.
    expect(firstRunRoute({ registeredEmail: 'a@b.co' })).toBe('HowToUse');
  });
});
