const apiEndpoints = {
    user: {
      createUser: '/user', // 사용자 생성
      checkNickname: '/user/check', // 사용자 닉네임 중복체크
      findUser: '/user/find', // 사용자 닉네임으로 조회
      deleteUser: (id: string | number) => `/user/${id}`, // 사용자 삭제
      getSalary: '/user/money', // 사용자 급여 조회
    },
    bunny: {
      getTodayBunny: '/bunny', // 오늘의 버니 조회
      updateMonthlyTarget: '/bunny', // 한달 목표 수정
      createMonthlyTarget: '/bunny/target', // 한달 목표 설정
      getHomeSalary: '/bunny/home-money', // 홈 화면 급여 조회
      deleteMonthlyTarget: (targetId: string | number) => `/bunny/${targetId}`, // 한달 목표 삭제
    },
    save: {
      createSavingAmount: '/save/money', // 아끼기 금액 설정
      createSavingIcon: '/save/icon', // 아끼기 항목 설정
      getMonthlySavings: '/save', // 먼슬리 아끼기 조회
      getSavingDetail: '/save/detail', // 아끼기 상세 스케줄 조회
      getSavingToday: '/save/today-saving', // 오늘의 아끼기 조회
      deleteSaving: (savingId: string | number) => `/save/${savingId}`, // 아낀 내역 삭제
    },
    swagger: {
      swaggerUI: '/swagger-ui/index.html', // Swagger UI 접속 URL
    },
  };
  
  export default apiEndpoints;
  