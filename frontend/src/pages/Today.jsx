import { useEffect, useState, useRef } from "react";
import CreateTaskForm from "../components/CreateTaskForm";


function Today() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const editingRef = useRef(false);
  const deletingRef = useRef(false);

  // Three-dot menu
  const [openMenuId, setOpenMenuId] = useState(null);

  // Edit task
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete task
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tasks/getAllTasks",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tasks");
        }

        if (!Array.isArray(data.data)) {
          throw new Error("Invalid tasks response");
        }

        setTasks(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);



  const today = new Date();


  const todayDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const startOfTomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const todaysTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);

    return (
      dueDate >= startOfToday &&
      dueDate < startOfTomorrow
    );
  });

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);






    return (
      dueDate < startOfToday &&
      task.status !== "completed" &&
      task.status !== "cancelled"
    );
  });


  const handleToggleComplete = async (task) => {
    const newStatus =
      task.status === "completed" ? "pending" : "completed";

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((currentTask) =>
          currentTask._id === task._id
            ? data.data
            : currentTask
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };



    // OPEN EDIT FORM
  const handleEditClick = (task) => {
    setEditingTaskId(task._id);

    setEditForm({
      title: task.title ?? "",
      description: task.description ?? "",
      status: task.status ?? "pending",
      priority: task.priority ?? "medium",
      dueDate: task.dueDate
        ? task.dueDate.slice(0, 10)
        : "",

    });

    setEditError("");
    setOpenMenuId(null);
  };

  // EDIT FORM CHANGE
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // UPDATE TASK
  const handleEditSubmit = async (e) => {
    e.preventDefault();

  //     console.log("SUBMIT CLICKED");
  // console.log("Title:", FormData.title);
  // console.log("Loading:", loading);
  // console.log("Submitting lock:", submittingRef.current);

    if (!editingTaskId || editingRef.current) return;

    if (!editForm.title.trim()) {
      setEditError("Task title is required");
      return;
    }

    editingRef.current = true;
    setEditLoading(true);
    setEditError("");
  

    const taskId = editingTaskId;

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...editForm,
            title: editForm.title.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setEditError(data.message || "Failed to update task");
        return;
      }

      if (!data.data?._id) {
        setEditError("Invalid update response");
        return;
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === data.data._id ? data.data : task
        )
      );

      setEditingTaskId(null);
      
    } catch (err) {
      console.error("Update task error:", err);
      setEditError("Unable to update task");
    } finally {
      editingRef.current = false;
      setEditLoading(false);
    }
  };

  // DELETE TASK
  const handleDelete = async () => {
    if (!deleteTaskId || deletingRef.current) return;

    deletingRef.current = true;
    setDeleteLoading(true);
    

    const taskId = deleteTaskId;

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
setError(data.message || "Failed to delete task");
        return;
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );

      setDeleteTaskId(null);
      // setMessage("Task deleted successfully");
    } catch (err) {
      console.error("Delete task error:", err);
setError("Unable to delete task");

    } finally {
      deletingRef.current = false;
      setDeleteLoading(false);
    }
  };



  return (



    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Today
      </h1>

      {!loading && (
        <div className="space-y-8">

          {/* Today's Tasks */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Today's Tasks ({todaysTasks.length})
            </h2>

            {/* ADD TASK BUTTON */}
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              + Add Task
            </button>

            {showCreateForm && (
              <CreateTaskForm
                defaultDueDate={todayDate}
                onTaskCreated={(newTask) => {
                  setTasks((prevTasks) =>
                    prevTasks.some((task) => task._id === newTask._id)
                      ? prevTasks
                      : [newTask, ...prevTasks]
                  );

                  setShowCreateForm(false);
                }}
                onCancel={() => setShowCreateForm(false)}
              />
            )}




            {todaysTasks.length === 0 ? (
              <p className="text-gray-500">
                No tasks scheduled for today.
              </p>
            ) : (
              <div className="space-y-3">
                {todaysTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >



                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => handleToggleComplete(task)}
                        className="h-4 w-4 cursor-pointer"
                      />

                      <div>
                        <h3
                          className={`font-medium ${task.status === "completed"
                              ? "line-through text-gray-400"
                              : ""
                            }`}
                        >
                          {task.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {task.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
  <span className="text-sm font-medium">
    {task.priority}
  </span>

  <div className="relative">
    <button
      type="button"
      onClick={() =>
        setOpenMenuId(
          openMenuId === task._id ? null : task._id
        )
      }
      className="rounded px-3 py-1 hover:bg-gray-100"
    >
      ⋮
    </button>

    {openMenuId === task._id && (
      <div className="absolute right-0 top-full z-10 w-32 rounded border bg-white shadow">
        <button
          type="button"
          onClick={() => handleEditClick(task)}
          className="block w-full px-3 py-2 text-left hover:bg-gray-100"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => {
            setDeleteTaskId(task._id);
            setOpenMenuId(null);
          }}
          className="block w-full px-3 py-2 text-left text-red-600 hover:bg-gray-100"
        >
          Delete
        </button>
      </div>
    )}
  </div>
</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Overdue Tasks */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Overdue Tasks ({overdueTasks.length})
            </h2>

            {overdueTasks.length === 0 ? (
              <p className="text-gray-500">
                No overdue tasks.
              </p>
            ) : (
              <div className="space-y-3">
                {overdueTasks.map((task) => (
                  <div
                    key={task._id}
                    className="rounded-lg border border-red-200 p-4"
                  >
                    <h3 className="font-medium">
                      {task.title}
                    </h3>

                    <p className="text-sm text-red-500">
                      Overdue
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}
      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <p>Total tasks: {tasks.length}</p>
      )}

      {/* EDIT TASK MODAL */}
{editingTaskId && (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

      <h2 className="mb-4 text-xl font-semibold">
        Edit Task
      </h2>

      <form onSubmit={handleEditSubmit} className="space-y-4">

        {/* TITLE */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={editForm.title}
            onChange={handleEditChange}
            className="w-full rounded border p-2"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            className="w-full rounded border p-2"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="block mb-1">Status</label>
          <select
            name="status"
            value={editForm.status}
            onChange={handleEditChange}
            className="w-full rounded border p-2"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* PRIORITY */}
        <div>
          <label className="block mb-1">Priority</label>
          <select
            name="priority"
            value={editForm.priority}
            onChange={handleEditChange}
            className="w-full rounded border p-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* DUE DATE */}
        <div>
          <label className="block mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={editForm.dueDate}
            onChange={handleEditChange}
            className="w-full rounded border p-2"
          />
        </div>

        {editError && (
          <p className="text-red-500">{editError}</p>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            disabled={editLoading}
            onClick={() => setEditingTaskId(null)}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={editLoading}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            {editLoading ? "Saving..." : "Save Changes"}
          </button>

        </div>
      </form>
    </div>
  </div>
)}


{/* DELETE CONFIRMATION MODAL */}
{deleteTaskId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

      <h2 className="text-xl font-semibold">
        Delete Task?
      </h2>

      <p className="mt-3 text-gray-600">
        Are you sure you want to delete this task?
        This action cannot be undone.
      </p>

      <div className="mt-6 flex justify-end gap-3">

        <button
          type="button"
          disabled={deleteLoading}
          onClick={() => setDeleteTaskId(null)}
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={deleteLoading}
          onClick={handleDelete}
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          {deleteLoading ? "Deleting..." : "Yes, Delete"}
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Today;