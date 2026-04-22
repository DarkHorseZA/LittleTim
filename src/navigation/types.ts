import { NavigatorScreenParams } from '@react-navigation/native';
import { FocusArea, PracticeKind } from '../types';

export type TabsParamList = {
  Today: undefined;
  Practice: { initialKind?: PracticeKind } | undefined;
  History: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  HowToUse: { firstRun?: boolean } | undefined;
  Tabs: NavigatorScreenParams<TabsParamList>;
  Belief: undefined;
  PracticeDetail: { practiceId: string };
  Tracker: undefined;
  FocusArea: { focusArea: FocusArea };
  Account: undefined;
  MorningRitual: undefined;
};
