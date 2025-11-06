import { TaskList } from './components/tasks/TaskList'
import { CreateTaskModal } from './components/tasks/CreateTaskModal'
import { EditTaskModal } from './components/tasks/EditTaskModal'
import { DeleteConfirmModal } from './components/tasks/DeleteConfirmModal'

function App() {
  return (
    <div className="w-1/2 mx-auto mt-10 text-gray-900 dark:bg-slate-900/90 dark:text-gray-100 rounded-lg border border-zinc-200 dark:border-sky-500">
      <TaskList />
      <CreateTaskModal />
      <EditTaskModal />
      <DeleteConfirmModal />
    </div>
  )
}

export default App
