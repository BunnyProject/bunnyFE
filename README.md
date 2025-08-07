# 🐰 Bunny - 실시간 수입 시각화 기반 절약 습관 형성 앱

**Bunny**는 사용자의 근무 시간과 시급을 기반으로 실시간 수입을 시각화하고, 절약 목표를 설정하여 소비 습관을 개선하도록 돕는 모바일 앱입니다. 애니메이션을 통해 절약의 재미를 더하고, 카테고리 기반 절약 기록과 월간 목표 관리 기능을 제공합니다.

![prj4-1](https://github.com/user-attachments/assets/1aabddd4-0b4e-4ed1-bb5d-d9e016e06644)
![prj4-2](https://github.com/user-attachments/assets/01186525-ebf0-4b42-b7d0-04b6b56dda90)


---

## ✨ 주요 기능

- **⏱ 실시간 수입 계산**: 출퇴근 시간에 따라 실시간 누적 수입 표시
- **📈 절약 목표 설정**: 월간 목표 금액을 설정하고 현재 수입과 비교하여 시각화
- **📅 달력 기반 기록 보기**: 절약한 항목을 날짜별로 확인하고 관리
- **📊 카테고리 기반 절약 기록**: 커피, 택시 등 사용자가 정의한 카테고리별로 기록
- **🐇 애니메이션 효과**: 절약 시 토끼 점프, 당근 낙하로 피드백 제공
- **💾 로컬 데이터 저장**: AsyncStorage 기반 상태 유지
- **🎨 사용자 맞춤 UI**: 카테고리별 색상 유지, 일관된 UX 흐름 설계

---

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| **프레임워크** | React Native |
| **언어** | TypeScript |
| **상태 관리** | React Hooks, AsyncStorage, Custom Hooks |
| **UI 컴포넌트** | react-native-svg, react-native-calendars, react-native-slider |
| **날짜 처리** | moment-timezone |
| **애니메이션** | 직접 구현 (Animated 미사용) |
| **API 통신** | fetch 기반 비동기 요청 + 로컬 상태 동기화 |

---

## 🔍 주요 화면 미리보기

| 홈 랜딩 | 절약페이지 랜딩 | 홈 (수입 그래프 상) | 홈 (수입 그래프 하) |
|---------------------|---------------------|--------------------------|-----------|
|<img width="347" height="678" alt="image (10)" src="https://github.com/user-attachments/assets/05f59699-dda3-44b8-95dd-4069ecf643f5" />| <img width="364" height="758" alt="image (9)" src="https://github.com/user-attachments/assets/e011d7d4-b232-44e9-9d7e-b7c313f31845" />|![image (8)](https://github.com/user-attachments/assets/096f7a80-a020-4ceb-a0ea-c0040e2657c9)|![image (9)](https://github.com/user-attachments/assets/53050bf1-31ef-4dbe-b4bf-ed576c894303)|

| 절약 항목 (카테고리 선택)| 절약 페이지 | 절약 달력 |절약 내역 | 
|---------------------|---------------------|--------------------------|-----------|
| ![image (6)](https://github.com/user-attachments/assets/f811cff5-4233-466e-b5ed-0118b7bcbe49)|<img width="362" height="751" alt="image (6)" src="https://github.com/user-attachments/assets/35558813-109f-44c6-9bb6-e4facb16084d" />| ![image (7)](https://github.com/user-attachments/assets/ec3d3e9a-8111-40c3-a59e-f260f4dd7f32) |<img width="367" height="672" alt="image (7)" src="https://github.com/user-attachments/assets/381a3d94-cda3-43a6-8257-d4a58eb05893" /> |

---
