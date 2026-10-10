import { NavigatorScreenParams } from '@react-navigation/native';
import { FocusArea, PracticeKind } from '../types';

export type TabsParamList = {
  Today: undefined;
  Practice: { initialKind?: PracticeKind | 'WHEN' } | undefined;
  Journal: { initialTab?: 'journal' | 'quilt' } | undefined;
  More: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  // afterTour marks the skip path (tour already taken) so the account screen
  // doesn't offer the tour a second time.
  EmailSignup: { firstRun?: boolean; afterTour?: boolean } | undefined;
  HowToUse: { firstRun?: boolean } | undefined;
  Tour: { firstRun?: boolean } | undefined;
  Tabs: NavigatorScreenParams<TabsParamList>;
  Belief: undefined;
  PracticeDetail: { practiceId: string; source?: 'today' };
  TriggerDetail: { triggerId: string };
  Tracker: undefined;
  FocusArea: { focusArea: FocusArea };
  Account: undefined;
  MorningRitual: undefined;
  Glossary: undefined;
  Connect: undefined;
  Settings: undefined;
  JournalPost: { url: string; title: string };
  NotFound: undefined;
};
