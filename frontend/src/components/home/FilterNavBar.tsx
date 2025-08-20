import { useState } from "react";
import { CreateTaskModal } from "./CreateTaskModal";

export default function FilterNavBar() {

    const[showModal, setShowModal] = useState(false);

    const openCreateTaskModal = () => {
        setShowModal(true);
    }

    const CloseModal = () => {
        setShowModal(false);
    }

    

  return (
    <div className="flex items-center gap-6 flex-row justify-between px-6 py-3 rounded-xl shadow-md">
      <div className="px-4 py-2 text-xl font-semibold">
        All Tasks
      </div>

      <div>
        <button onClick={openCreateTaskModal} className="bg-blue-600 text-white font-semibold rounded-md py-2 px-4 hover:bg-blue-700 transition duration-200 shadow">
            Create Task
        </button>
      </div>

      {
        showModal && <CreateTaskModal close={CloseModal} />
      }
    </div>
  );
}