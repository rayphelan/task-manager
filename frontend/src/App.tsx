import { TaskList } from './components/tasks/TaskList';
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { EditTaskModal } from './components/tasks/EditTaskModal';
import { DeleteConfirmModal } from './components/tasks/DeleteConfirmModal';

function App() {
  return (
    <div className="min-h-screen w-full px-2 sm:px-4 lg:px-8 py-6 text-gray-900 bg-slate-900/90">
      <div className="w-3/4 mx-auto">
        <TaskList />
        <CreateTaskModal />
        <EditTaskModal />
        <DeleteConfirmModal />
      </div>
    </div>
  );
}

export default App;
