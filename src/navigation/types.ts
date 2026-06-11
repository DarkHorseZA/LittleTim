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
  EmailSignup: { firstRun?: boolean } | undefined;
  HowToUse: { firstRun?: boolean } | undefined;
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
