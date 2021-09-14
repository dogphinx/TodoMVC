addClassFunc
- 돔핸들링

inputText
- value넘겨주기만함

saveTodoItem
- todo를 dom그려내고, 스토리지 적재를 2차호출

- todoRender()
renderTodoItemLayout - 이것도 돔 렌더링

- const STORAGE_KEY = ‘todoList’
  saveData - 스토리지 적재 -
  //storageData(‘set’, {id:4, title:‘할일 신규’})
  //storageData(‘get’, id) // id= 4

function storageData(type, id){
    if ( type === ‘set’ ) {
      // [{},{},{}] -> id가동일하면, 덮어쓰니까!
      // id 동일한거 있는지 검사, 없을때 -> 그냥넣고,
      // id가 겹친다 -> id 신규생성해서 넣고.
      localStorage.getItem(STORAGE_KEY)
      return
    }

    // get 임을 의미
    if ( !id ) {
      console.log(“id 없음“)
      return;
    }

    const storage = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return storage.filter((todo) => todo.id === id) // id 일치하는 todo
}

X deleteTodoItem - 돔핸들링 + 스토리지적재 (saveData)
- 신규추가/삭제/완료
- (C)추가 : todoDataParse.create({id: 5, title: “할일5” status: ‘ACTIVE’})
- (U)변경 : todoDataParse.update(4, STATUS_CODE.ACTIVE)
- (D)삭제 : todoDataUpdate(‘[1]’)
- 완료 : todoDataParse.update(4, STATUS_CODE.COMPLETED)

// param todo: { 5: { title: “할일5" status: ‘ACTIVE’} }
// param status (optional) : ‘COMPLETED’, ‘ACTIVE’
const todoDataParse {
  create(todo){
    return todoData.push(todo)
  },

  update(id, status){
    // id를 뽑는다. Object.keys(todo) (배열로 넘어옴. [“5”])
    { ...todoData,
      [id]:{
        ...todoData[id],
        status: statusCode.status
      }
    }
  },

  delete(idArray){
    // Array.includes() ES6
    todoData[...todoData.filter( todo => !idArray.includes(todo.id))]
  }
}

countTotal - 돔핸들링 + 수셈 ?

X isDoneFunc - 완료된거 솎아냄
X activeFunc - 미완인거 솎아냄
X showCompleted - 완료한거 솎아낸걸 Dom 페인팅
- todoRender(status.completed)

X showActive - active만 보이게 함 - 돔핸들링
- todoRender(status.active)

allClear - completed 전체삭제,
- status === COMPLETED 만 뽑아서, id만 뽑은 Array 생성
- todoDataParse.delete(deleteTodoId) // completed만 뽑아서.
- todoRender(status.clear)

1. (목록을 그려내든 삭제하든 등등) todo -> newTodoArr를 기반으로 그려냄.

const statusCode = {
  completed: ‘COMPLETED’,
  active: ‘ACTIVE’,
  clear: ‘CLEAR’,
}

const todoData = []

// 인풋 추가
const todoData = [
{id:1, title: ‘할일1’, status: ‘COMPLETED’},
{id:2, title: ‘할일2’, status: ‘ACTIVE’ },
]

// 돔핸들링. todo를 ‘그려낸다’
function todoRender(status) {
  // status = undefined (status 필요없음. = 전체 렌더)
  // status = status.completed (완료된것만)
  // status = status.active (안한것만)
  // status = status.clear (완료된것 영구삭제)

    if ( status === status.completed ) {
      todoData.filter((todo, index)=> todo.status !== ‘COMPLETED’)
      // 그려낸 뒤,
      return <></>
    }

  // 내가 원하는 todo만 남는다.
  todoData.filter((todo, index)=> todo.status !== status)
  // DOM 을 리스트를 그려냄.
}

storageDataSet
todoListRender

todoRender
  - list()
  - count / total()

todoDataParse
  - .create()
  - .update()
  - .delete()




