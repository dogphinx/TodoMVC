const toDoApp = document.querySelector('.todoapp');
const toDoInput = toDoApp.querySelector('.new-todo');
const toDoList = toDoApp.querySelector('.todo-list');
const mainSection = toDoApp.querySelector('.main');
// 통일성을 위해 변수명에 elem 을 붙이려면 다 붙이고 안붙이려면 다 안붙이게 해야함! const $blarblar 형태도 있는데, 협업할 때는 지양하는게 좋을듯하다!

const statusCode = {
  // ??? 이러한 형태를 뭐라고 알려주셨던거같은데 기억이안나용 ㅠㅠ..
  // 다른값은 들어갈 수 없도록 고정시켜준다?
  active: 'ACTIVE',
  completed: 'COMPLETED',
};

/*
const buttonSelected = {
  // default 는 all 이고, 해당 버튼을 눌렀을 때 그 상태를 저장하여 로드시에도 그 상태를 유지하게 한다.
  // selected = all -> all 활성화 이렇게 하면, 오타같은거 방지가 안되니까.
  // 어떤 값(selected)에 할당 selected.All 이런식으로 그럼 그 값이 ALL 이 된다. 이러면 값이 지정이 되어버려서 다른값은 못들어오게된다.
  All: 'ALL',
  Active: 'ACTIVE',
  Completed: 'COMPLETED',
  // toDos 에 관련된건 toDos 로 묶고싶고, buttonSelected 에 관한건 그것으로 묶고싶어.
}; 처음에 이렇게 짰으나, data 객체 안에 selected 로 넣음.*/

// COMMENT let toDos => '원천 데이터' (api) /get/todos [{},{},{}]
// 현재 데이터의 모양을 위의 코멘트처럼 적어주면 시각화 되어서 생각하기 더 편한것같다! 데이터 가공할 때 적어두기!
// 이번에는 원천데이터 가공을 하기로했으니 let 으로 사용하여 loadToDos() 에서 toDos = JSON.parse(loadedToDos) 를 하기때문에 let 으로 사용함.
// let toDos = [];

const data = {
  toDos: [],
  selected: {
    All: 'ALL',
    Active: 'ACTIVE',
    Completed: 'COMPLETED',
  },
};

// const { toDos, selected } = data; const 로 묶어서 비구조화 할당하면 직접 데이터 변형할때 문제발생, 그렇다고 let 으로 묶기엔 selected 는 굳이? 라는 생각이 듬.
let toDos = data.toDos;
const selected = data.selected;

/*
// ??? 비구조화 할당을 하고 싶은데, data is not iterable 라고함. 이터러블 객체를 생성하던지 아니면 toDos = data.toDos 이러한 형태로 하던지 해야할듯함. => const [toDos, selected] = data; 이렇게 하면 오류뜸 { } 형태로 하면 오류안뜸. 왜일까????????
const [toDos, selected] = data;
console.log(data);
console.log(toDos);
console.log(selected);
*/

function handleToDoSubmit(e) {
  if (e.key === 'Enter') {
    // COMMENT
    // inputValue = ''; <- 기대효과
    // todoInput.value = string = Primitive Type
    // var a = 'hi';
    // var b = a;
    // b = ''; -> a= ''
    // var objA = { a: 'hi' } // memory ABC
    // var objB = objA // 깊은복사가 됨 (참조를 그대로 연결함)
    // 참조값 그대로 연결 ? -> 메모리 주소를 대입해버림.
    // objB.a = 'hello' => a도 바껴요
    // 얕은복사를 수행 -> var objB = {...objA} // memory BBB

    addToDosNewItem(toDoInput.value);
    toDoInput.value = '';
    makeToDoHtml(toDos[toDos.length - 1]);
  }
  saveLocalStorage('toDos', toDos);
  countList();
}

toDoInput.addEventListener('keydown', handleToDoSubmit);

function deleteToDo(e) {
  // 해당 아이디 찾아서 투두 삭제

  // [COMMENT]
  // e.target = button
  // e.target.closest('li') -> html (root)
  // const select[Li] = selectTodoItem / targetTodo / deleteItem
  // result) const todo = e.target.closest('li');
  const selectLi = e.target.closest('.todo-list li');

  toDos = toDos.filter(toDo => {
    // console.log(toDo.id);
    // console.log(selectLi.id);
    return toDo.id !== selectLi.id;
  });

  toDoList.removeChild(selectLi);

  // 바뀐 todos 를 다시 로컬스토리지에 반영
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
  // saveToDos() 다시 부를 필요가?
  // filter 를 이용해서 '삭제'만 간결화 해보아요
  // toDos = changeToDo;
  //saveToDos();
  // loadToDos();
  if (toDos.length === 0) {
    hideSection();
  }
  countList();
}

function makeToDoHtml(toDoItem) {
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
    // addClassCompleted(li, input);
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
function paintToDo() {
  toDos.map(toDoItem => {
    makeToDoHtml(toDoItem);
    // if (toDoItem.status === statusCode.completed) {
    //   // const toDoLi = document.querySelector(`#${toDoItem.id}`);
    //   debugger;
    //   console.log('작동되나?');}
  });
}

// function addClassCompleted(li, input) {
//   li.classList.add('completed');
//   input.checked = true;
// }

/*
// 연습용 - COMMENT
function paintToDo2() {
  
    // { text: "가나다라", id: 1, completed: true, }
    // { text: "밥먹기", id: 2, completed: false, }
  

  toDos.map(todo => {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const label = document.createElement('label');
    const delBtn = document.createElement('button');

    input.type = 'checkbox';
    input.className = 'toggle';
    label.innerText = todo.text;

    delBtn.className = 'destroy';
    delBtn.addEventListener('click', deleteToDo);

    li.append(input, label, delBtn);
    li.id = newId;
    todoList.appendChild(li);
  });

  // const toDoObj = {
  //   text: text,
  //   id: newId,
  // };

  // toDos.push(toDoObj);
  // newId += 1;
  // console.log(toDoObj);
  // console.log(toDos);
  // saveToDos();
  mainSectionElem.style.display = 'block';
}*/

function addToDosNewItem(text) {
  const toDoObj = {
    text,
    id: guid(),
    status: statusCode.active,
  };

  toDos.push(toDoObj);
}

/*
function saveLocalStorage() {
  try {
    localStorage.setItem('toDos', JSON.stringify(toDos));
  } catch (error) {
    alert(error);
  }
  // localStorage 에는 자바스크립트 data 는 저장할 수 없음. 오직 string만 저장가능. 그러므로 object 가 string 이 되도록 만들어야함! 그래서 JSON.stringify 사용(JavaScript 값이나 객체를 JSON 문자열로 변환)
}*/

function saveLocalStorage(name, Key) {
  try {
    const [name] = Object.keys(data); // [toDos, selected] 형태를 비구조화 할당
    console.log(Object.keys(data));
    localStorage.setItem(name, JSON.stringify(Key));
  } catch (error) {
    alert(error);
  }
  // localStorage 에는 자바스크립트 data 는 저장할 수 없음. 오직 string만 저장가능. 그러므로 object 가 string 이 되도록 만들어야함! 그래서 JSON.stringify 사용(JavaScript 값이나 객체를 JSON 문자열로 변환)
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

function loadToDos() {
  const loadedToDos = localStorage.getItem('toDos');
  try {
    if (loadedToDos === null) return;
    toDos = JSON.parse(loadedToDos);
    paintToDo();
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

function checkToggleBtn(e) {
  // [모든 리스트 체크 토글 + 각 아이템별 체크 토글]
  // 모두 체크되어있냐? 예(체크해제) : 체크

  /* [X] 이렇게하면 접근방법이 잘못됨.
  toDos = [
    ...toDos,
    {
      text:
      id: e.target.closest('.todo-list li').id,
      status: 'statusCode.completed',
    },
  ]; */

  // [toggle-all 버튼]
  const toggleAll = document.querySelector('#toggle-all');
  if (e.target === toggleAll) {
    /* [X] 이렇게 하면 각각에 대한 return 결과가 여러개가 나와서 find 로 해야함.
    toDos.map(toDoItem => {
      if (toDoItem.status !== statusCode.completed) {
        // active 가 하나라도 있을 경우
        console.log('active 가 하나라도 있을 경우');
        return;
      } else {
        // active 가 없이 모두다 completed 인 경우
        console.log('모두 completed');
        return;
      }
    });  */

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
      if (
        toDoList.querySelectorAll('.hide').length === toDoList.children.length
      ) {
        for (const values of toDoList.querySelectorAll('.hide').values()) {
          values.classList.remove('hide');
        }
      } else {
        hideAndShow();
      }
    } else if (document.querySelector('.selected').innerText === 'Completed') {
      console.log('test');
      if (
        toDoList.querySelectorAll('.completed').length ===
        toDoList.children.length
      ) {
        for (const values of toDoList.querySelectorAll('.hide').values()) {
          values.classList.remove('hide');
        }
      } else {
        hideAndShow();
      }
    }
    saveLocalStorage('toDos', toDos);

    // [각 toDoItem 개별 체크]
  } else if (e.target.parentElement.parentElement === toDoList) {
    // [ toDoItem status 변경]
    if (e.target.closest('.todo-list li').classList.contains('completed')) {
      // [해당 id 의 class 가 completed 일 때,]
      statusCodeChange(e, statusCode.active);
      e.target.closest('.todo-list li').classList.remove('completed');
      hideAndShow();
    } else {
      // [해당 id 의 class 가 completed 가 아닐 때,]
      statusCodeChange(e, statusCode.completed);
      e.target.closest('.todo-list li').classList.add('completed');
      hideAndShow();
    }
    saveLocalStorage('toDos', toDos);
    doesToggleAllChecked();
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

function hideAndShow() {
  const toDoNodeList = toDoList.childNodes;
  // changeSelected 해서 바꾼다음에,
  const classNameSelected = document.querySelector('.selected');
  if (classNameSelected.innerText === 'Active') {
    for (const values of toDoNodeList.values()) {
      if (!values.classList.contains('completed')) continue;
      values.classList.add('hide');
    }
  } else if (classNameSelected.innerText === 'Completed') {
    for (const values of toDoNodeList.values()) {
      if (values.classList.contains('completed')) continue;
      values.classList.add('hide');
    }
  }
}

function showEachStatusBtn(e) {
  // Active, Completed [버튼]
  // completed 클래스가 있냐 없냐에 따라서 display 바꿈
  // console.log(toDoNodeList);
  const classNameHide = toDoList.querySelectorAll('.hide');

  function changeSelected() {
    const classNameSelected = document.querySelector('.selected');
    classNameSelected.classList.remove('selected');
    e.target.classList.add('selected');
  }

  /*
  // querySelectorAll 정적 컬렉션이라 라이브 콜렉션으로 변경해보자. - 버튼 눌릴때마다 다시 불러오면 되니까 굳이 라이브콜렉션 필요없다고 판단.
  const classNameHide = toDoList.childNodes;

  console.log(classNameHide);
  const tt = Array.from(classNameHide);
  console.log(tt);
  tt.map(toDoItem => {
    if (toDoItem.classList.value !== 'completed') return;
    toDoItem.classList.add('hide');
  });
  // debugger; */

  for (const values of classNameHide.values()) {
    values.classList.remove('hide');
  }

  if (e.target.innerText === 'All') {
    // for (const values of classNameHide.values()) {
    //   values.classList.remove('hide');
    // }
    changeSelected();
  }

  // [Active 버튼]
  if (e.target.innerText === 'Active') {
    /*
    // 모든 li hide 옵션 제거
    for (const values of classNameHide.values()) {
      values.classList.remove('hide');
    }
    // ul 아래 차일드 display none 나머지만 보여주기.
    // toDoNodeList
    for (const values of toDoNodeList.values()) {
      if (!values.classList.contains('completed')) {
        // console.log('111');
        continue;
        // console.log('continue 테스트?');
      }

      values.classList.add('hide');
    } function hideAndShow 로 묶음 */
    changeSelected();
    hideAndShow();
  }

  // [Completed 버튼]
  if (e.target.innerText === 'Completed') {
    /*
    // 모든 li hide 옵션 제거
    for (const values of classNameHide.values()) {
      values.classList.remove('hide');
    }

    for (const values of toDoNodeList.values()) {
      if (values.classList.contains('completed')) continue;

      values.classList.add('hide');
    } function hideAndShow 로 묶음 */
    changeSelected();
    hideAndShow();
  }

  // debugger;
}

function showClearBtn() {
  if (toDoList.querySelector('.completed') === null) {
    document.querySelector('.clear-completed').style.display = 'none';
  } else {
    document.querySelector('.clear-completed').style.display = 'block';
  }
}

function clearCompleted() {
  // 완료된 것만 지우기.
  toDos = toDos.filter(toDo => {
    return toDo.status === statusCode.active;
  });
  saveLocalStorage('toDos', toDos);
  for (
    let i = document.querySelectorAll('.completed').length - 1;
    i >= 0;
    i--
  ) {
    document.querySelectorAll('.completed')[i].remove();
  }

  countList();
  showClearBtn();
}

function countList() {
  // 완료 체크 되지않은 리스트의 갯수를 span 태그에 넣기.
  const toDoCount = document.querySelector('.todo-count');
  // 전체 차일드 숫자 - completed 갯수만 제외
  const activeCount =
    toDoList.childElementCount - toDoList.querySelectorAll('.completed').length;
  toDoCount.innerText = `${activeCount} ${
    activeCount <= 1 ? 'item' : 'items'
  } left`;
}

// [이벤트 위임]
toDoApp.addEventListener('click', function (e) {
  // [toDoItem Input checkbox, toggle-all checkbox]
  if (e.target.tagName === 'INPUT') {
    // if (e.target.className === 'toggle-all') { 로 하게되면 toDoItem 마다 다시 또 반복하게 됨. 같은 input 들에 대해서 아래 두 함수가 같이 실행되어도 괜찮다고 판단.
    // input(checkbox) 클릭시 실행되게
    checkToggleBtn(e);
    countList();
    showClearBtn();
  }
  // [All, Active, Completed 버튼]
  // ↓ if (e.target.tagName === 'A') showEachStatusBtn(e); A 버튼으로 하면 확실치 않으니 정확하게 해당이름일 때만 작동하게 변경.
  if (Object.values(selected).includes(e.target.innerText.toUpperCase()))
    showEachStatusBtn(e);

  // [clearCompleted 버튼]
  // tagName 으로 했더니, Clear completed 와 각 아이템의 deleteToDo 기능이 겹침.
  // if (e.target.tagName === 'BUTTON') clearCompleted();
  if (e.target.innerText === 'Clear completed') clearCompleted();

  // 필터 셀렉트 상태에 따라서 추가로 조절하는건 어떨까?
  // all 이면 그대로 active 이면 done 이나 toggle-all 클릭시 active 버튼을 다시 누른것과 같은 효과?
  // 아니면 클릭 동작에 대해서 그때그때

  if (toDoList.childElementCount === 0) {
    hideSection();
  }
});

window.addEventListener('load', function () {
  loadToDos();
  countList();

  doesToggleAllChecked();
  showClearBtn();
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
