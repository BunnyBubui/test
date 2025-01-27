import React, { useState } from "react";
import "./Header.css";

function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [total, setTotal] = useState("");
  const [operation, setOp] = useState("");

  const handleNum1 = (event) => {
    setNum1(event.target.value);
  };

  const handleNum2 = (event) => {
    setNum2(event.target.value);
  };

  const handleOperation = (op) => {
    setOp(op);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (num1 && num2) {
      const number1 = parseFloat(num1);
      const number2 = parseFloat(num2);
      let result;
      switch (operation) {
        case "add":
          result = number1 + number2;
          break;
        case "sub":
          result = number1 - number2;
          break;
        case "multi":
          result = number1 * number2;
          break;
        case "divide":
          result = number2 !== 0 ? number1 / number2 : "Cannot divide by zero";
          break;
        default:
          result = "Please select an operation";
      }

      setTotal(result);
      showModal();
    }
  };

  function showModal() {
    const modal = document.getElementById("resultModal");
    modal.style.display = "flex";
  }

  function closeModal() {
    const modal = document.getElementById("resultModal");
    modal.style.display = "none";
  }

  return (
    <>
      <div className="card">
        <div className="table">
          <div className="h2">Simple Calculator</div>
          <form className="input">
            <div className="card_in">
              <input
                type="number"
                value={num1}
                onChange={handleNum1}
                placeholder="Enter Num1"
              />
            </div>
            <div className="card_in">
              <input
                type="number"
                value={num2}
                onChange={handleNum2}
                placeholder="Enter Num2"
              />
            </div>
          </form>

          <div className="button_card">
            <button
              onClick={() => handleOperation("add")}
              className={operation === "add" ? "selected" : ""}
            >
              ADD
            </button>
            <button
              onClick={() => handleOperation("sub")}
              className={operation === "sub" ? "selected" : ""}
            >
              SUBSTRACT
            </button>
            <button
              onClick={() => handleOperation("multi")}
              className={operation === "multi" ? "selected" : ""}
            >
              MULTIPLY
            </button>
            <button
              onClick={() => handleOperation("divide")}
              className={operation === "divide" ? "selected" : ""}
            >
              DIVIDE
            </button>
          </div>

          <button onClick={handleFormSubmit}>Calculate</button>
        </div>
      </div>

      <div id="resultModal" className="modal">
        <div className="modal-content">
          <h2>Result</h2>
          <p>The result is {total}</p>
          <button onClick={() => closeModal()} className="modal-button">
            OK
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
