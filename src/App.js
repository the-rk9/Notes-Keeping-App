import React, { useEffect, useState } from "react";

// get the localStorage data back
const getLocalData = () => {
  const userNotes = localStorage.getItem("userNotes");

  if (userNotes) {
    return JSON.parse(userNotes);
  } else {
    return [];
  }
};

function App() {
  const [inputData, setInputData] = useState({
    title: "",
    description: "",
  });

  const [usersDataMap, setUsersDataMap] = useState(getLocalData());
  const [isEdit, setIsEdit] = useState("");
  const [isToggle, setIsToggle] = useState(false);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setInputData({ ...inputData, [name]: value });
  };

  const formSubmit = (e) => {
    e.preventDefault();

    const isTrue = usersDataMap.some((data) => {
      if (inputData.title === data.title) {
        return true;
      } else {
        return false;
      }
    });

    if (isTrue) {
      alert("Title Of Any Notes Cannot Be Same!");
    } else if (!inputData.title || !inputData.description) {
      alert("Fill The Form!");
    } else if (inputData.title && isToggle) {
      setUsersDataMap(
        usersDataMap.map((curElem) => {
          if (curElem.id === isEdit) {
            return { ...curElem, ...inputData };
          }
          return curElem;
        })
      );
      setInputData({ title: "", description: "" });
      setIsEdit("");
      setIsToggle(false);
    } else {
      const newRecord = { ...inputData, id: new Date().getTime().toString() };
      setUsersDataMap([...usersDataMap, newRecord]);
      setInputData({ title: "", description: "" });
    }
  };

  const editNote = (index) => {
    const edit_this = usersDataMap.find((value) => {
      return value.id === index;
    });
    setInputData({
      title: edit_this.title,
      description: edit_this.description,
    });
    setIsToggle(true);
    setIsEdit(index);
  };

  const deleteNote = (index) => {
    const updateRecord = usersDataMap.filter((values) => {
      return values.id !== index;
    });
    setUsersDataMap(updateRecord);
  };

  //set data to local storage
  useEffect(() => {
    localStorage.setItem("userNotes", JSON.stringify(usersDataMap));
  }, [usersDataMap]);

  const [myStyle, setMyStyle] = useState({
    color: "",
  });

  const val = [
    "rgba(251, 0, 145, 1)",
    "rgba(251, 0, 92, 1)",
    "rgba(148, 0, 251, 1)",
    "rgba(106, 0, 251, 1)",
    "rgba(34, 189, 0, 1)",
    "rgba(23, 0, 251, 1)",
  ];

  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMyStyle({ color: val[count] });
      setCount((count) => (count === 5 ? 0 : count + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="container center">
      <form
        className="row gy-2 gx-3 align-items-center my-1 mx-5"
        onSubmit={formSubmit}
      >
        <div className="col-auto">
          <label className="visually-hidden" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            onChange={handleInput}
            value={inputData.title}
            name="title"
            autoComplete="off"
            className="form-control"
            id="title"
            placeholder="Enter Title"
          />
        </div>

        <div className="input-group">
          <textarea
            style={{ height: "100px", widht: "100px", resize: "none" }}
            className="form-control"
            aria-label="With textarea"
            onChange={handleInput}
            value={inputData.description}
            name="description"
            id="description"
            placeholder="Enter Description"
          ></textarea>
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-success">
            {isToggle ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {usersDataMap.map((values) => {
        return (
          <div
            className="card shadow p-3 mb-5 bg-body rounded"
            style={{ width: "18rem", margin: "10px", marginLeft: "250px" }}
            key={values.id}
          >
            <div className="card-body">
              <h5 className="card-title" style={myStyle}>
                {values.title}
              </h5>
              <p className="card-text">{values.description}</p>
              <span style={{ marginLeft: "60px" }}>
                <i
                  className="far fa-edit btn btn-primary"
                  onClick={() => editNote(values.id)}
                />
                <i
                  className="far fa-trash-alt btn btn-danger"
                  onClick={() => deleteNote(values.id)}
                />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
