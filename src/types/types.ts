// RootStackParamList
export type RootStackParamList = {
  Landing: undefined;
  UserInfo: undefined;
  UserInfo2: {name: string; birthDate: string; gender: string; job: string};
  UserInfo3: {
    salaryType: string;
    salary: string;
    workDays: string[];
    startTime: string;
    endTime: string;
  };
  Loading: undefined;
  Result: {
    name: string;
    birthDate: string;
    gender: string;
    job: string;
    salary: string;
    workDays: string[];
    startTime: string;
    endTime: string;
  };
  HomeTab: undefined;
  Home: undefined;
  Bunny: undefined;
  Akki: undefined;
  IconSelectScreen: undefined;
  AkkiStartScreen: undefined;
  MoreScreen: undefined;
};

// TabBarIcon Props
export type TabBarIconProps = {
  routeName: string;
  color: string;
  size: number;
};

// SavingStackNavigator Props
export type SavingStackNavigatorProps = {
  isFirstSavingClick: boolean;
};
