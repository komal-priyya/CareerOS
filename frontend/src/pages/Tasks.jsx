




import React from "react";
import { useEffect, useState, useRef } from "react";

const defaultForm = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

const Tasks = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // THREE-DOT MENU
  const [openMenuId, setOpenMenuId] = useState(null);

  // DELETE STATES
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // EDIT STATES
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ ...defaultForm });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const requestIdRef = useRef(null);
  const submittingRef = useRef(false);
  const deletingRef = useRef(false);
  const editingRef = useRef(false);

  // TASK LIST STATES
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");

  // CREATE TASK FORM STATE
  const [FormData, setFormData] = useState(() => {
    let saved = {};

    try {
      saved = JSON.parse(localStorage.getItem("taskDraft")) || {};
    } catch {
      saved = {};
    }

    return {
      title: saved.title ?? "",
      description: saved.description ?? "",
      status: saved.status ?? "pending",
      priority: saved.priority ?? "medium",
      dueDate: saved.dueDate ?? "",
    };
  });

  // SAVE FORM DRAFT
  useEffect(() => {
    localStorage.setItem("taskDraft", JSON.stringify(FormData));
  }, [FormData]);

  // CREATE FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    requestIdRef.current = null;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // CLEAR FORM FIELD
  const handleClear = (fieldName) => {
    requestIdRef.current = null;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  // CREATE TASK
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submittingRef.current) return;

    if (!FormData.title?.trim()) {
      setError("Task title is required");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setError("");
    setMessage("");

    if (!requestIdRef.current) {
      requestIdRef.current = crypto.randomUUID();
    }

    const payload = {
      ...FormData,
      title: FormData.title.trim(),
      reqId: requestIdRef.current,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/tasks/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Task creation failed");
        return;
      }

      setMessage(data.message || "Task created successfully");

      if (data.data?._id) {
        setTasks((prevTasks) => {
          const alreadyExists = prevTasks.some(
            (task) => task._id === data.data._id
          );

          if (alreadyExists) return prevTasks;

          return [data.data, ...prevTasks];
        });
      }

      requestIdRef.current = null;
      setFormData({ ...defaultForm });
    } catch (err) {
      console.error("Create task error:", err);
      setError("Network error. You can retry the same task.");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  // GET ALL TASKS
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setTasksLoading(true);
        setTasksError("");

        const response = await fetch(
          "http://localhost:5000/api/tasks/getAllTasks",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        console.log("GET Tasks response:", data);

        if (!response.ok) {
          setTasksError(data.message || "Failed to fetch tasks");
          return;
        }

        if (!Array.isArray(data.data)) {
          setTasksError("Invalid tasks response");
          return;
        }

        setTasks(
          [...data.data].sort(
            (a, b) =>
              new Date(b.createdAt || 0) -
              new Date(a.createdAt || 0)
          )
        );
      } catch (err) {
        console.error("Fetch tasks error:", err);
        setTasksError("Unable to load tasks");
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, []);

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

    if (!editingTaskId || editingRef.current) return;

    if (!editForm.title.trim()) {
      setEditError("Task title is required");
      return;
    }

    editingRef.current = true;
    setEditLoading(true);
    setEditError("");
    setMessage("");

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
      setMessage("Task updated successfully");
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
    setTasksError("");
    setMessage("");

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
        setTasksError(data.message || "Failed to delete task");
        return;
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );

      setDeleteTaskId(null);
      setMessage("Task deleted successfully");
    } catch (err) {
      console.error("Delete task error:", err);
      setTasksError("Unable to delete task");
    } finally {
      deletingRef.current = false;
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="mb-4 text-xl font-semibold">Create Task</h2>

      {/* CREATE TASK FORM */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>

          <div className="relative w-full max-w-md">
            <input
              id="title"
              name="title"
              placeholder="Enter Task title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10"
              value={FormData.title}
              onChange={handleChange}
              required
            />

            {FormData.title && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-600 hover:text-red-500"
                onClick={() => handleClear("title")}
                aria-label="Clear title"
              >
                ×
              </button>
            )}
          </div>

          <div className="mt-3">
            <label htmlFor="description">Description</label>

            <div className="relative w-full max-w-md">
              <input
                id="description"
                name="description"
                placeholder="Enter task description"
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10"
                value={FormData.description}
                onChange={handleChange}
              />

              {FormData.description && (
                <button
                  type="button"
                  onClick={() => handleClear("description")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-600"
                  aria-label="Clear description"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label htmlFor="status">Status</label>

          <select
            id="status"
            name="status"
            value={FormData.status}
            onChange={handleChange}
            className="ml-2 rounded border p-2"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In-Progress</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mt-3">
          <label htmlFor="priority">Priority</label>

          <select
            id="priority"
            name="priority"
            value={FormData.priority}
            onChange={handleChange}
            className="ml-2 rounded border p-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mt-3">
          <label htmlFor="dueDate" className="block mb-1">
            Due Date
          </label>

          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={FormData.dueDate}
            onChange={handleChange}
            className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        {error && (
          <p role="alert" className="mt-2 text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Add Task"}
        </button>
      </form>

      {/* TASK LIST */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">My Tasks</h2>

        {message && (
          <p role="status" className="mb-3 text-green-600">
            {message}
          </p>
        )}

        {tasksLoading && <p>Loading tasks...</p>}

        {tasksError && (
          <p role="alert" className="mb-3 text-red-500">
            {tasksError}
          </p>
        )}

        {!tasksLoading && !tasksError && tasks.length === 0 && (
          <p>No tasks yet. Create your first task.</p>
        )}

        {!tasksLoading &&
          tasks.map((task) => (
            <div
              key={task._id}
              className="relative mb-4 rounded-lg border border-gray-300 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">
                    Title: {task.title}
                  </h3>

                  <p>Description: {task.description}</p>
                  <p>Status: {task.status}</p>
                  <p>Priority: {task.priority}</p>

                  <p>
                    Due Date:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>

                {/* THREE-DOT MENU */}
                <div className="relative">
                  <button
                    type="button"
                    aria-label={`Options for ${task.title}`}
                    aria-expanded={openMenuId === task._id}
                    onClick={() =>
                      setOpenMenuId((prev) =>
                        prev === task._id ? null : task._id
                      )
                    }
                    className="rounded px-3 py-1 text-2xl hover:bg-gray-100"
                  >
                    ⋮
                  </button>

                  {openMenuId === task._id && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border bg-white p-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => handleEditClick(task)}
                        className="block w-full rounded px-3 py-2 text-left text-gray-800 hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTaskId(task._id);
                          setOpenMenuId(null);
                        }}
                        className="block w-full rounded px-3 py-2 text-left text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </section>

      {/* EDIT TASK MODAL */}
      {editingTaskId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-heading"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h2
              id="edit-heading"
              className="mb-4 text-xl font-semibold text-gray-900"
            >
              Edit Task
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="edit-title"
                  className="block text-gray-800"
                >
                  Title
                </label>

                <input
                  id="edit-title"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded border p-2 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-gray-800"
                >
                  Description
                </label>

                <input
                  id="edit-description"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2 text-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-status"
                  className="block text-gray-800"
                >
                  Status
                </label>

                <select
                  id="edit-status"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2 text-gray-900"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-priority"
                  className="block text-gray-800"
                >
                  Priority
                </label>

                <select
                  id="edit-priority"
                  name="priority"
                  value={editForm.priority}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2 text-gray-900"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>


              <div>
                <label
                  htmlFor="edit-dueDate"
                  className="block text-gray-800"
                >
                  Due Date
                </label>

                <input
                  type="date"
                  id="edit-dueDate"
                  name="dueDate"
                  value={editForm.dueDate}
                  onChange={handleEditChange}
                  className="w-full rounded border p-2 text-gray-900"
                />
              </div>
              {editError && (
                <p role="alert" className="text-red-600">
                  {editError}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  disabled={editLoading}
                  onClick={() => {
                    setEditingTaskId(null);
                    setEditError("");
                  }}
                  className="rounded border px-4 py-2 text-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
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
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-heading"
            aria-describedby="delete-description"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-heading"
              className="text-xl font-semibold text-gray-900"
            >
              Delete Task?
            </h2>

            <p
              id="delete-description"
              className="mt-2 text-gray-600"
            >
              Are you sure you want to delete this task?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteTaskId(null)}
                className="rounded border px-4 py-2 text-gray-800"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDelete}
                className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

