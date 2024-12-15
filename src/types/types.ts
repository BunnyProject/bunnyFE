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
    userId: number;
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
  AkkiScreen: undefined;
  IconSelectScreen: undefined;
  AkkiStartScreen: undefined;
  MoreScreen: undefined;
  Saving: undefined;
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

// UserData 타입 정의
export interface UserData {
  name: string;
  birth: string;
  gender: 'FEMALE' | 'MALE';
  job: '학생' | '직장인' | '프리랜서' | '주부' | '무직' | '기타';
  monthMoney: number;
  workDay: string[];
  workingTime: string; // 수정됨
  quittingTime: string; // 수정됨
}

export interface HomeMoneyResponse {
  resultType: string;
  success?: {
    minMoney: number;
    hourMoney: number;
    secondMoney: number;
  };
  error?: {
    message: string;
  };
}

export interface bunnyResponse {
  resultType: 'SUCCESS' | 'FAIL';
  success?: {
    minMoney: number; // 사용자 ID
    workingTime: string;
    quttingTime: string;
  };
  error?: {
    message: string;
  };
};

export interface CreateUserResponse {
  resultType: 'SUCCESS' | 'FAIL';
  success?: {
    id: number; // 사용자 ID
    message: string;
  };
  error?: {
    message: string;
  };
};

export interface SaveMoneyParams {
  memberNo: number;
  categoryId: number;
  categoryName: string;
  detail: string;
  savingDay: string;
  savingPrice: number;
};

export interface TodaySavingCategory {
  categoryId: number;
  categoryName: string;
  totalSavingChance: number;
  totalSavingCategoryMoney: number;
};

export interface TodaySavingResponse {
  todayTotalMoney: number;
  todaySavingCategoryList: TodaySavingCategory[];
};

export type MonthlySavingResponse = {
  savingId: number;
  categoryName: string;
  savingChance: number;
  savingDay: string;
  savingPrice: number;
}[];

export type MonthlySaving = {
  savingId: number;
  categoryName: string;
  savingChance: number;
  savingDay: string;
  savingPrice: number;
};

export type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    selectedColor?: string;
    dots?: { key: string; color: string }[];
  };
};

export interface DetailSaveMoney {
  savingId: number;
  categoryId: number;
  categoryName: string;
  detail: string;
  savingPrice: number;
  savingDay: string;
}

export interface SavingChance {
  categoryId: number;
  categoryName: string;
  totalSavingChance: number;
}

export interface SaveDetailResponse {
  resultType: string;
  success: {
    detailSaveMoneyList: DetailSaveMoney[];
    totalSavingMoney: number;
    savingChanceList: SavingChance[];
    totalCategorySavingMoney: number;
  };
  error?: {
    message: string;
  };
}

export type DeleteSavingResponse = {
  resultType: 'SUCCESS' | 'ERROR';
  success?: {
    message: string;
    savingId: number;
  };
  error?: {
    message: string;
  };
};
