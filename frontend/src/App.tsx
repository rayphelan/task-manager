import { TaskList } from './components/tasks/TaskList'
import { CreateTaskModal } from './components/tasks/CreateTaskModal'
import { EditTaskModal } from './components/tasks/EditTaskModal'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <TaskList />
      <CreateTaskModal />
      <EditTaskModal />
    </div>
  )
}

export default App
