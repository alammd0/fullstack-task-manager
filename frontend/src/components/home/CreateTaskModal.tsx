import { useState } from "react";
import { createTask } from "../../services/taskAPI";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";

type Priority = "Low" | "Medium" | "High";
type assignedTo = number | null;

export function CreateTaskModal({ close }: { close: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Low");
  const [dueDate, setDueDate] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<assignedTo>();
  const [documents, setDocuments] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const token = useSelector((state: any) => state.auth.token);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const newTask : Task = {
    //   title,
    //   description,
    //   priority,
    //   dueDate,
    //   assignedTo,
    //   documents,
    // };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", priority);
    formData.append("dueDate", dueDate);
    formData.append("assignedTo", String(Number(assignedTo)));
    documents.forEach( (file : File) => formData.append("documents", file));

    try{
        setLoading(true);
        // @ts-ignore
        const response =  await createTask({task : formData, token});

        console.log(response);

        if(!response.data){
            toast.error(response.message);
            setLoading(false);
            return;
        }

        toast.success(response.message);
        navigate("/home");
        setLoading(false);
    }
    catch(error){
      console.error(error);
      setLoading(false);
    }
    close(); 
    setLoading(false);
  };


  if(loading){
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400 bg-opacity-50">
      <Spinner />
    </div>
  }

  return (
    <div className="fixed inset-0 z-50 bg-opacity-40 flex items-center justify-center bg-gray-600/80 animate-fadeIn">
      <div className="bg-white rounded-2xl px-6 py-4 shadow-2xl w-full max-w-md transform animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center p-2">
          <h1 className="text-xl font-bold text-center text-gray-800">
            Create Task
          </h1>
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputField
            label="Title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <TextAreaField
            label="Description"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
          <SelectField
            label="Priority"
            id="priority"
            options={["Low", "Medium", "High"]}
            value={priority}
            onChange={(e: any) => setPriority(e.target.value)}
          />
          <InputField
            label="Due Date"
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e: any) => setDueDate(e.target.value)}
          />
          <InputField
            label="Assigned To"
            type="number"
            id="assignedTo"
            placeholder="User ID"
            value={assignedTo}
            onChange={(e: any) => setAssignedTo(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documents
            </label>
            <input
              type="file"
              id="documents"
              multiple
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {documents.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {documents.length} file(s) selected
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 w-full text-white font-semibold rounded-md py-2 px-4 hover:bg-blue-700 transition duration-200 shadow"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}

/* Helper Components */
function InputField({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}

function TextAreaField({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}

function SelectField({ label, id, options, ...props }: any) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        {...props}
        id={id}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        {options.map((opt: string, idx: number) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
