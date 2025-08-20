import { useEffect, useState } from "react";
import { getTasks, getFilteredTasks } from "../../services/taskAPI";
import { useSelector } from "react-redux";
import { useRef } from "react";
import TaskCard from "./TaskCard";

type Priority = "Low" | "Medium" | "High";
type Status = "Open" | "InProgress" | "Completed";

export default function TaskSection() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ priority: Priority | ""; status: Status | "" }>({ priority: "", status: "" });

  const token = useSelector((state: any) => state.auth.token);

  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const priorityRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        priorityRef.current &&
        !priorityRef.current.contains(e.target as Node)
      ) {
        setPriorityOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!token) return;
    if (filters.priority || filters.status) {
      fetchFilteredTasks();
    } else {
      fetchAllTasks();
    }
  }, [token, filters]);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(token);
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredTasks = async () => {
    try {
      setLoading(true);
      const filter: any = {};
      if (filters.priority) filter.priority = filters.priority;
      if (filters.status) filter.status = filters.status;
      const data = await getFilteredTasks({ token, filter });
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Error fetching filtered tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(tasks);
  console.log(filters);

  const handleFilterChange = (type: "priority" | "status", value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div>
      <div className="flex gap-10 items-center justify-center">
        <div className="relative" ref={priorityRef}>
          <button
            onClick={() => setPriorityOpen(!priorityOpen)}
            className="px-4 py-2 border text-xl rounded-lg hover:bg-gray-200 transition"
          >
            {filters.priority ? filters.priority : "Priority"}
          </button>
          {priorityOpen && (
            <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-48 px-2 py-4">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    handleFilterChange("priority", p);
                    setPriorityOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="px-4 py-2 text-xl border rounded-lg hover:bg-gray-200 transition"
          >
            {filters.status ? filters.status : "Status"}
          </button>
          {statusOpen && (
            <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-48 px-4 py-2">
              {["Open", "InProgress", "Completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    handleFilterChange("status", s);
                    setStatusOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-2xl font-bold mt-14">No tasks found.</p>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
            {tasks.map((task) => (
                <div key={task.id} >
                    <TaskCard task={task} />
                </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

