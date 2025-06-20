import { useState } from "react";
import notes from "../images/notes-notepad-svgrepo-com.png";
import "./projectGestionnaireTachesStyle.css";
import toDo_list from "../components/simulatedDataList";

export default function ProjectGestionTaches() {
  // #region 1 time Data
  const [isExample, setIsExample] = useState(
    !JSON.parse(localStorage.getItem("example"))
  );
  function generateExample() {
    if (!JSON.parse(localStorage.getItem("example"))) {
      localStorage.setItem("toDoList", JSON.stringify(toDo_list));
      localStorage.setItem("example", JSON.stringify(true));
      setIsExample(false);
      window.location.reload();
    }
  }
  // #endregion 1 time Data
  const [dataToDo, setDataToDo] = useState(() => {
    try {
      const saved = localStorage.getItem("toDoList");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  });
  const [isDone, setIsDone] = useState(undefined);
  const [orderDefine, setOrderDefine] = useState("createdAt");

  function addTask() {
    let taskText = document.querySelector("#addTask");
    if (taskText.value.trim() !== "") {
      setDataToDo((current) => {
        const copyArray = [...current];
        const data = {
          task: taskText.value, // ✅ fix here
          priority: "low",
          isChecked: false,
          createdAt: new Date().toISOString(),
        };
        copyArray.push(data);
        localStorage.setItem("toDoList", JSON.stringify(copyArray));
        return copyArray;
      });
      taskText.value = "";
    }
  }

  function changePriority(key, priority) {
    const priorityArray = ["low", "medium", "high"];
    const searchIndex = priorityArray.findIndex((index) => index === priority);
    const alternatePriority = (searchIndex + 1) % priorityArray.length;
    updateData(key, "priority", priorityArray[alternatePriority]);
  }

  function changeChecked(key, isChecked) {
    updateData(key, "isChecked", isChecked);
  }

  function updateData(key, option, diffData, deleteBool) {
    setDataToDo((current) => {
      if (deleteBool === true) {
        const copyArray = current.filter((_, index) => index !== key);
        localStorage.setItem("toDoList", JSON.stringify(copyArray));
        return copyArray;
      } else {
        const copyArray = [...current];
        const copyModified = { ...current[key] };
        copyModified[option] = diffData;
        copyArray[key] = copyModified;
        localStorage.setItem("toDoList", JSON.stringify(copyArray));
        return copyArray;
      }
    });
  }

  function filterByDone(conditionOfFilter) {
    setIsDone(conditionOfFilter);
  }

  function orderBy(me) {
    const chosenOrder =
      me.value === "name"
        ? "task"
        : me.value === "priority"
        ? "priority"
        : "createdAt";
    setOrderDefine(chosenOrder);
  }

  function deleteTask(key) {
    updateData(key, null, null, true);
  }

  return (
    <section className="p-5 flex flex-col gap-5">
      <div className="flex gap-2.5 items-center text-[38px]">
        <img className="h-[38px]" src={notes} alt="notesLogo" />
        <h1 className="font-semibold">Task Manager</h1>
      </div>
      <div className="flex gap-2.5">
        <input
          type="text"
          name="addTask"
          id="addTask"
          placeholder="Add a task..."
          className="w-full bg-gray-200 rounded-[7px] border-2 border-gray-400 placeholder:text-gray-500 focus:outline-[3px] focus:outline-[#487BBE] p-2 box-border"
        />
        <button onClick={addTask} className="blueBtn">
          Add
        </button>
      </div>
      <div>
        <div id="filterBar" className="flex justify-between">
          <div id="categories" className="flex gap-1.5">
            <button
              onClick={() => filterByDone(undefined)}
              className={isDone === undefined ? "blueBtn" : ""}
            >
              All
            </button>
            <button
              onClick={() => filterByDone(false)}
              className={isDone === false ? "blueBtn" : ""}
            >
              To do
            </button>
            <button
              onClick={() => filterByDone(true)}
              className={isDone === true ? "blueBtn" : ""}
            >
              Done
            </button>
          </div>
          <select onChange={(e) => orderBy(e.target)} id="orderBy">
            <option value="date">Date</option>
            <option value="priority">Priority</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      <main className="max-h-[600px] overflow-y-auto flex flex-col gap-2.5">
        {isExample && (
          <button
            onClick={generateExample}
            className="bg-green-600 py-[5px] rounded-[15px] text-white font-semibold w-[200px] self-center cursor-pointer"
          >
            Générer des exemples
          </button>
        )}
        {dataToDo
          .sort((a, b) => {
            return b[orderDefine].localeCompare(a[orderDefine]);
          })
          .filter((item) =>
            isDone === undefined ? true : item.isChecked === isDone
          )
          .map((item, key) => {
            return (
              <div
                key={key}
                className="bg-gray-200 box-border p-2.5 rounded-[5px] flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2.5 overflow-x-hidden ">
                  <input
                    onChange={(evnt) => changeChecked(key, evnt.target.checked)}
                    type="checkbox"
                    checked={item.isChecked}
                  />
                  <p className="overflow-x-auto whitespace-nowrap">
                    {item.task}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => changePriority(key, item.priority)}
                    className={
                      (item.priority === "high"
                        ? "bg-red-400 text-red-800"
                        : item.priority === "medium"
                        ? "bg-amber-400 text-amber-800"
                        : "bg-cyan-400 text-cyan-800") +
                      " font-bold box-border px-2.5 py-1 rounded-[15px] cursor-pointer"
                    }
                  >
                    {item.priority}
                  </button>
                  <button
                    onClick={() => deleteTask(key)}
                    className="text-gray-400 hover:text-red-600 cursor-pointer aspect-square text-[20px] h-[32px] font-bold"
                  >
                    X
                  </button>
                </div>
              </div>
            );
          })}
      </main>
    </section>
  );
}
