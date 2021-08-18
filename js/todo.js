// 로컬 스토리지를 통해 데이터 저장
// What needs to be done? 에 내용을 치고 enter 하면 아래로 종이 겹치는 모양으로 나타나면서
// 현재 아이템 갯수
// all , active, completed 세가지 옵션이 생김
// 각 아이템에 마우스를 가져다대면 x 버튼이 보여짐
// 삭제시 해당 아이템 삭제 = 고유 id 필요
// 아이템이 생길 ul 하나에 푸터 하나
// toggle-all 라벨을 누르면 다 체크됨
// ul 아래 라벨 - 내용 - x 버튼
// todolist 가 하나도 없을시 toggle-all 안보임

const todoInput = document.querySelector('.new-todo'),
  todoList = document.querySelector('.todo-list'),
  mainSectionElem = document.querySelector('.main');

let toDos = [];
// console.log(todoInput)
// console.log(todoList)

function handleToDoSubmit(e) {
  if (e.key === 'Enter') {
    console.log('엔터키 눌려짐');
    // toDos.push(e.target.value)
    let inputValue = todoInput.value;
    // console.log(inputValue);
    todoInput.value = '';
    paintToDo(inputValue);
  }
}

todoInput.addEventListener('keydown', handleToDoSubmit);

function deleteToDo(e) {
  // 해당 아이디 찾아서 투두 삭제
  console.log(e);
  console.log(e.path[1].id);
  const selectLi = e.path[1];
  todoList.removeChild(selectLi);
  localStorage.removeItem('toDos');
  const changeToDo = toDos.filter(toDos => {
    console.log(toDos.id);
    console.log(typeof toDos.id);
    console.log(typeof parseInt(e.path[1].id));
    return toDos.id !== parseInt(e.path[1].id);
  });
  console.log(changeToDo);
  toDos = changeToDo;
  saveToDos();
  // loadToDos();
}

function paintToDo(text) {
  const li = document.createElement('li'),
    input = document.createElement('input'),
    label = document.createElement('label'),
    delBtn = document.createElement('button'),
    newId = toDos.length + 1;

  input.type = 'checkbox';
  input.className = 'toggle';
  label.innerText = text;
  delBtn.className = 'destroy';
  // delBtn.innerText = '❌';
  delBtn.addEventListener('click', deleteToDo);
  li.appendChild(input);
  li.appendChild(label);
  li.appendChild(delBtn);
  li.id = newId;
  todoList.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId,
  };
  toDos.push(toDoObj);
  // console.log(toDoObj);
  // console.log(toDos);
  saveToDos();
  mainSectionElem.style = 'display:block';
}

function saveToDos() {
  localStorage.setItem('toDos', JSON.stringify(toDos));
  // localStorage 에는 자바스크립트 data 는 저장할 수 없음. 오직 string만 저장가능. 그러므로 object 가 string 이 되도록 만들어야함! 그래서 JSON.stringify 사용(JavaScript 값이나 객체를 JSON 문자열로 변환)
}

function loadToDos() {
  const loadedToDos = localStorage.getItem('toDos');
  const parseToDos = JSON.parse(loadedToDos);
  // console.log(parseToDos);
  if (loadedToDos === null) return;
  parseToDos.forEach(elem => {
    // console.log(elem.text);
    paintToDo(elem.text);
  });
}

loadToDos();
