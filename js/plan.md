- 체크 토글
function checkToggle(e) {}
각 해당 toDoItem 에 대하여 (toDos = [ {}, {}, {}] toDos 배열안의 객체가 toDoItem)

[완료]로드시점 그려낼때 status가 completed 이면, li 클래스에 completed 추가

[완료]토글 화살표 체크박스 개념이고 하위 체크가 모두 체크되면 전체선택이 자동체크 (input 에 checked 가 되어야함.)


- All / Active / Completed 
ul class='filters' 아래에 li a 에 selected 변경해줘야하고 다른 나머지는 selected 풀어야함.
active 에 selected 이면, status 에서 active 상태만 남기고 나머지 li 삭제
li 들을 다시 그리지말고 display 속성을 이용해서 하는게 좋을듯?


토글 올 - All, Active, Completed 버튼에 따라 어떻게 반응하는지 체크해보기
Active, Completed 버튼에 토글올에 따라 상태가 변할시 어떻게 반응하는지

active - class가 completed 가 아닌애들만 보여주고
새로고침했을 때 필터의 상태조차 기억을 하고있어야함. : toDos 에 상태를 추가해줘야함. 그리고 그것에 맞게 selected 를 구현해야함.

실시간 html collection / nodelist 가 필요한것

매일매일 보지않고 건너뛰어서 보게되면, 함수명을 보고 빠르게 이해가 안가. -> 함수명을 변경해주거나, 주석을 달아주어야할 거 같아.




1. 라이브 콜렉션일때, 그때그때마다 다르게 불러와질수 있는가?
https://developer.mozilla.org/ko/docs/Web/API/MutationObserver

MutationObserver 를 이용해서, 변화를 감지해서 그때 어떠한 펑션을 실행.
어떠한 펑션은 어떤일을 하면될까?
다시 load 해주는 역할?

변수 에 selected 상태를 true false 로 넣어줘야할것같아. 저장을 한다음에 그걸 로컬스토리지에 저장을 따로 해줘서
toDos 따로 읽고, selected 상태를 따로 읽으면 되지않을까?
- default 는 all 이고, 해당 버튼을 눌렀을 때 그 상태를 저장하여 로드시에도 그 상태를 유지하게 한다.
- 어떤 값(selected)에 할당 selected.All 이런식으로 그럼 그 값이 ALL 이 된다. 이러면 값이 지정이 되어버려서 다른값은 못들어오게된다.

*라이브 콜렉션 
어떠한 행동을 할때 completed 이면 무조건 안보여야함.
- 그때그때 변수에 불러와서 한다면 크게 문제없는 부분.

*어떤 이벤트가 발생할때마다 active completed 가 실시간 갱신되어야한다? - MutationObserver 로 감지해서 콜백함수로 실행.


active 나 completed 버튼이 눌러져있을 때,
각 체크 버튼이나 토글버튼 클릭이 발생했을 때, hide 붙이거나 떼거나

각 버튼별로 작동
active 클래스가 completed 애들이있으면 hide 붙이기
completed 클래스가 completed 가 아닌애들에 hide 붙이기


-----------------------------------------------
이제 보이는대로 기능구현은 끝났으니 리팩토링 

[toDos]
- addToDosNewItem 
  투두스에 새 아이템 추가

- guid
  식별 아이디 생성

- handleToDoSubmit
  투두 제출 핸들링

- deleteToDo
  투두 삭제

- paintToDo (이름을 바꿀까?)
  ToDoItem html 에 그리기.

- statusCodeChange
  statusCode 변경

- checkToggleBtn
  전체 체크버튼에 따른 기능 응집
  개별 체크버튼에 따른 기능
  active 상태일 때 전부다 hide 일 때 hide 제거해서 다 보이게 풀기
  completed 상태일 때 전부다 

- toDoHideToggle
  toDoItem 에 대한 hide 토글

- doesToggleAllChecked
  토글 전부다 체크표시가 되어있는지 확인

- filterBtn
  All / Active / Completed 필터 버튼에 대한 제어

- countList
  active 갯수 세기

[toDos - clearBtn]
- showClearBtn
  clear 버튼 showing 제어

- clearCompleted
  clear 버튼 눌러서 completed 만 삭제



[localStorage]
- saveLocalStorage
  로컬스토리지에 데이터 저장
  * filter 상태 저장

- loadToDos
  로컬스토리지에서 데이터 불러와서 데이터 보여줌

- loadSelected
  로드했을 때 이전에 선택한 selected 버튼 활성화





