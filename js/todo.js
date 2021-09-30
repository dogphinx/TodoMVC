const toDoApp = document.querySelector('.todoapp');
const toDoInput = toDoApp.querySelector('.new-todo');
const mainSection = toDoApp.querySelector('.main');
const toDoList = toDoApp.querySelector('.todo-list');
const data = {
  toDos: [],
  selected: {
    All: 'ALL',
    Active: 'ACTIVE',
    Completed: 'COMPLETED',
  },
  statusCode: {
    active: 'ACTIVE',
    completed: 'COMPLETED',
  },
  // ??? 이러한 형태를 뭐라고 알려주셨던거같은데 기억이안나용 ㅠㅠ..
  // 다른값은 들어갈 수 없도록 고정시켜준다?
};
// [비구조화 할당으로 data.blar 를 보기편하게 변경]
let { toDos } = data;
const { selected, statusCode } = data;

// [로컬스토리지에 저장할 ToDosObj폼]
function addToDosNewItem(text) {
  const toDoObj = {
    text,
    id: guid(),
    status: statusCode.active,
  };
  toDos.push(toDoObj);
}

// [UUID 생성]
function guid() {
  function s4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    /*
    (1 + Math.random() * 0x10000을 사용하여 1~65536 난수를 생성함 → 이 값을 x로 설정합니다.
    x | 0비트 연산, 아니 오히려 연산 → 문이 0인 숫자는 숫자의 정수 부분만 유지하는 것과 같습니다 → 이것은 y가 됩니다.
    y.to 문자열(16)을 16진수로 지정합니다. 이것은 z가 됩니다.
    z.substring(1) 첫 번째 문자에서 왼쪽으로 잘라서 뒤에 오는 문자열을 유지합니다.
    */
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  );
}

function handleToDoSubmit(e) {
  if (e.key === 'Enter') {
    addToDosNewItem(toDoInput.value);
    toDoInput.value = '';
    paintToDo(toDos[toDos.length - 1]);
  }
  saveLocalStorage('toDos', toDos);
  countList();
}

toDoInput.addEventListener('keydown', handleToDoSubmit);

function deleteToDo(e) {
  // [해당 아이디에 해당하는 toDo 삭제]
  const selectLi = e.target.closest('.todo-list li');

  toDos = toDos.filter(toDo => {
    return toDo.id !== selectLi.id;
  });

  toDoList.removeChild(selectLi);
  saveLocalStorage('toDos', toDos);

  // [COMMENT]
  // 1. Array.find  -> id 를 가진 todo 를 찾아요. findIndex
  // toDos = ? Array 원천 자체를 수정 slice, concat , splice
  // const changeToDo = toDos.filter(toDos => {
  //   console.log(toDos.id);
  //   console.log(typeof toDos.id);
  //   console.log(typeof parseInt(e.path[1].id));
  //   return toDos.id !== parseInt(e.path[1].id);
  // });
  // console.log(changeToDo);

  // [COMMENT]
  // saveToDos() 다시 부를 필요가?  ????????? 이건 음....불러야하지않나?ㅠㅠㅠ...어떻게 안부르고 처리할 수 가 있을지..
  // filter 를 이용해서 '삭제'만 간결화 해보아요
  // toDos = changeToDo;
  //saveToDos();
  // loadToDos();

  if (toDos.length === 0) {
    hideSection();
  }
  countList();
}

function paintToDo(toDoItem) {
  const li = document.createElement('li');
  const input = document.createElement('input');
  const label = document.createElement('label');
  const delBtn = document.createElement('button');

  input.type = 'checkbox';
  input.className = 'toggle';
  delBtn.className = 'destroy';
  delBtn.addEventListener('click', deleteToDo);

  li.id = toDoItem.id;
  if (toDoItem.status === statusCode.completed) {
    li.classList.add('completed');
    input.checked = true;
  }
  label.innerText = toDoItem.text;
  li.append(input, label, delBtn);
  toDoList.appendChild(li);

  mainSection.style.display = 'block';
}

// COMMENT
// paintTodo() -> 하나의 todo를 그려내는 함수가 아닌, 'data'를 받아서, 전체 그림
// '반복'의 횟수는, paintTodo 가 정함.

// paintTodo(todoList<Array>) {}
// paintTodo -> toDos <-

/*
// ??? querySelector 에 아래처럼 `` 백틱을 이용해서 표현식을 쓸 수 있나요? 가능
// const toDoLi = document.querySelector(`#${toDoItem.id}`);
// const toDoLi = document.querySelector('#'+`${toDoItem.id}`);
* ↑ 위처럼 uuid 형태는 CSS3 가 숫자로 시작하는 ID 선택기를 지원하지 않으므로 나오지않음.
HTML5 문서에서 숫자 로 시작 하는 ID 를 사용할 수 있습니다.
값은 요소의 홈 하위 트리에 있는 모든 ID에서 고유해야 하며 하나 이상의 문자를 포함해야 합니다. 값은 공백 문자를 포함할 수 없습니다.
ID가 취할 수 있는 형식에 대한 다른 제한은 없습니다. 특히 ID는 숫자로만 구성되거나, 숫자로 시작하고, 밑줄로 시작하고, 구두점으로만 구성될 수 있습니다.

그러나 querySelector메서드는 DOM 쿼리를 위해 CSS3 선택기를 사용하고 CSS3는 숫자로 시작하는 ID 선택기를 지원하지 않습니다.
https://stackoverflow.com/questions/37270787/uncaught-syntaxerror-failed-to-execute-queryselector-on-document/37271406
*/

function saveLocalStorage(name, Key) {
  // 로컬스토리지에 toDos 데이터와 selected 상태 저장
  try {
    localStorage.setItem(name, JSON.stringify(Key));
  } catch (error) {
    alert(error);
  }
  // localStorage 에는 자바스크립트 data 는 저장할 수 없음. 오직 string만 저장가능. 그러므로 object 가 string 이 되도록 만들어야함! 그래서 JSON.stringify 사용(JavaScript 값이나 객체를 JSON 문자열로 변환)
}

function loadToDos() {
  const loadedToDos = localStorage.getItem('toDos');
  try {
    if (loadedToDos === null) return;
    toDos = JSON.parse(loadedToDos);
    toDos.map(toDoItem => {
      paintToDo(toDoItem);
    });
  } catch (error) {
    alert(error);
  }
}

function hideSection() {
  mainSection.style.display = 'none';
}

function statusCodeChange(e, changeStatus) {
  // 이벤트가 발생한 toDoItem에, 두번째 매개변수에 해당하는 statusCode로 변경.
  toDos.map(toDoItem => {
    if (toDoItem.id === e.target.closest('.todo-list li').id) {
      toDoItem.status = changeStatus;
    }
  });
}

function toDoHideToggle() {
  // [Active 또는 Completed 일 때 hide 제어]
  const selectedBtn = document.querySelector('.selected');
  if (selectedBtn.innerText === 'Active') {
    // Active 버튼활성화 -> completed 클래스를 지니고있으면 hide
    for (const values of toDoList.childNodes.values()) {
      if (!values.classList.contains('completed')) continue;
      values.classList.add('hide');
    }
  } else if (selectedBtn.innerText === 'Completed') {
    // Completed 버튼활성화 -> completed 클래스를 가지고있지않으면 hide
    for (const values of toDoList.childNodes.values()) {
      if (values.classList.contains('completed')) continue;
      values.classList.add('hide');
    }
  }
}

// [토글올 화살표 checked 여부]
// 모든 toDoItem 들이 checked 이면, 토글체크 checked
function doesToggleAllChecked() {
  toDoList.childElementCount ===
  document.querySelectorAll('.todo-list li input:checked').length
    ? (document.querySelector('#toggle-all').checked = true)
    : (document.querySelector('#toggle-all').checked = false);
}

function checkToggleBtn(e) {
  // [모든 리스트 체크 토글 + 각 아이템별 체크 토글]
  // 모두 체크되어있냐? 예(체크해제) : 체크

  // [toggle-all 버튼]
  const toggleAll = document.querySelector('#toggle-all');
  if (e.target === toggleAll) {
    // [filter - All 체크되어 있을 때]
    // [전부 completed 일 때, undefined 반환 -> 체크를 풀고 active 로 변경]
    if (
      toDos.find(toDoItem => toDoItem.status === statusCode.active) ===
      undefined
    ) {
      toDos.map(toDoItem => (toDoItem.status = statusCode.active));
      // status 가 complete 일 때 일어나는 현상들 여기오게 (checked 랑 li class에 추가 )
      for (let i = 0; i < toDoList.childElementCount; i++) {
        toDoList.children[i].classList.remove('completed');
        toDoList.children[i].firstElementChild.checked = false;
      }
    } else {
      // [모두 active 이거나 하나라도 active 가 있으면 -> 모두 complete 로 변경]
      toDos.map(toDoItem => (toDoItem.status = statusCode.completed));
      for (let i = 0; i < toDoList.childElementCount; i++) {
        if (toDoList.children[i].classList.contains('completed')) continue;
        toDoList.children[i].classList.add('completed');
        toDoList.children[i].firstElementChild.checked = true;
      }
    }

    if (document.querySelector('.selected').innerText === 'Active') {
      // [filter - Active 체크되어 있을 때]
      if (
        // 전부 다 hide 일 때 -> hide 제거해서 보이게
        toDoList.querySelectorAll('.hide').length === toDoList.children.length
      ) {
        for (const values of toDoList.querySelectorAll('.hide').values()) {
          values.classList.remove('hide');
        }
      } else {
        toDoHideToggle();
      }
    } else if (document.querySelector('.selected').innerText === 'Completed') {
      // [filter - Completed 체크되어 있을 때]
      if (
        // 전부 다 completed 일 때 -> hide 제거 (누른시점을 헷갈리지말자 누른 후 바뀌는 상태를 인지)
        toDoList.querySelectorAll('.completed').length ===
        toDoList.children.length
      ) {
        for (const values of toDoList.querySelectorAll('.hide').values()) {
          values.classList.remove('hide');
        }
      } else {
        toDoHideToggle();
      }
    }

    // [각 toDoItem 개별 체크]
  } else if (e.target.parentElement.parentElement === toDoList) {
    // [ toDoItem status 변경]
    if (e.target.closest('.todo-list li').classList.contains('completed')) {
      // [해당 id 의 class 가 completed 일 때,]
      statusCodeChange(e, statusCode.active);
      e.target.closest('.todo-list li').classList.remove('completed');
      toDoHideToggle();
    } else {
      // [해당 id 의 class 가 completed 가 아닐 때,]
      statusCodeChange(e, statusCode.completed);
      e.target.closest('.todo-list li').classList.add('completed');
      toDoHideToggle();
    }
    doesToggleAllChecked();
  }

  saveLocalStorage('toDos', toDos);
}

function filterBtn(e) {
  for (const values of toDoList.querySelectorAll('.hide').values()) {
    values.classList.remove('hide');
  }

  document.querySelector('.selected').classList.remove('selected');
  e.target.classList.add('selected');

  toDoHideToggle();

  saveLocalStorage('selected', e.target.innerText);
}

function showClearBtn() {
  if (toDoList.querySelector('.completed') === null) {
    document.querySelector('.clear-completed').style.display = 'none';
  } else {
    document.querySelector('.clear-completed').style.display = 'block';
  }
}

function clearCompleted() {
  // [completed 인 toDo 식제]
  toDos = toDos.filter(toDo => {
    return toDo.status === statusCode.active;
  });
  saveLocalStorage('toDos', toDos);

  for (let i = document.querySelectorAll('.completed').length; i > 0; i--) {
    document.querySelectorAll('.completed')[i - 1].remove();
  }

  countList();
  showClearBtn();
}

function countList() {
  // [완료 체크 되지않은 리스트의 갯수를 span(.todo-count) 태그에 넣기]
  // 전체 toDo Child 숫자 - completed 갯수만 제외
  const activeCount =
    toDoList.childElementCount - toDoList.querySelectorAll('.completed').length;
  document.querySelector('.todo-count').innerText = `${activeCount} ${
    activeCount <= 1 ? 'item' : 'items'
  } left`;
}

function loadSelected() {
  // 로컬스토리지에 selected 데이터가 없으면 리턴, 데이터가 있으면 데이터이름의 버튼으로 selected 클래스 지정
  try {
    const loadedSelectedStatus = localStorage.getItem('selected');
    if (loadedSelectedStatus === null) return;
    if (JSON.parse(loadedSelectedStatus) === 'All') return;
    toDoApp.querySelector('.selected').classList.remove('selected');

    const filterBtns = toDoApp.querySelectorAll('.filters a');
    const filterBtns_arr = Array.prototype.slice.call(filterBtns);
    filterBtns_arr
      .find(btn => btn.innerText === JSON.parse(loadedSelectedStatus))
      .classList.add('selected');
    toDoHideToggle();
  } catch (error) {
    alert(error);
  }
}

// [이벤트 위임]
toDoApp.addEventListener('click', function (e) {
  // [toDoItem Input checkbox, toggle-all checkbox]
  if (e.target.tagName === 'INPUT') {
    checkToggleBtn(e);
    countList();
    showClearBtn();
  }
  // [All, Active, Completed 버튼]
  // ↓ if (e.target.tagName === 'A') showEachStatusBtn(e); A 버튼으로 하면 확실치 않으니 정확하게 해당이름일 때만 작동하게 변경.
  if (Object.values(selected).includes(e.target.innerText.toUpperCase()))
    filterBtn(e);

  // [clearCompleted 버튼]
  // tagName 으로 했더니, Clear completed 와 각 아이템의 deleteToDo 기능이 겹침.
  // if (e.target.tagName === 'BUTTON') clearCompleted();
  if (e.target.innerText === 'Clear completed') clearCompleted();

  if (toDoList.childElementCount === 0) {
    hideSection();
  }
});

window.addEventListener('load', function () {
  loadToDos();
  countList();

  doesToggleAllChecked();
  showClearBtn();
  loadSelected();
});

/* // 보류
///////////////////////////// MutationObserver test
const target = toDoList;
console.log(target);
const observer = new MutationObserver(mutations => {
  console.log(mutations);
  mutations.forEach(function (mutation) {
    console.log(mutation.type);
  });
});

const option = {
  attributes: true,
  childList: true,
  characterData: true,
};

observer.observe(target, option);
// MutationObserver 의 target
A DOM Node (which may be an Element) within the DOM tree to watch for changes, or to be the root of a subtree of nodes to be watched. 하나의 돔노드에 대해서 감시하는 것이므로 현재 내 상황에서는 사용하기 어렵다고 판단. toDoList 각각에 classList 변경을 감지하고자 하였음.
// https://www.demo2s.com/javascript/javascript-dom-register-a-mutationobserver-to-many-targets.html 두가지 타겟이상 감시할때.
==========> 지인에게 물어봤더니 처음보시는 거라고함. 안쓰는데는 이유가 있을거라고 하셔서 일단 MutationObserver 사용은 보류.
==========> 왜 사용하려고 했는가? class 를 감지해서 각 클래스별로 콜백함수를 관리하기에 용이할 것이라고 생각 더 응집력이 높아질 것이라고 기대함.
*/

/*
const selected = {
  // 정확하게 뭘 하고 싶은가?
  // toDos 처럼 로컬 스토리지에 따로 하나의 상태에 대해서만 관리해서
  // 초기에 selected 해 둘 상태를 유지하고 저장하고 읽어들이고 싶다.
  localStorage: {
    save: function () {},
    load: function () {},
  },
  browser: {
    load: function () {},
  },
}; */
