import { useState, useEffect, useReducer } from "react";
import "./calendar.scss";

function reducer(state, action) {
  switch (action.type) {
    case "SELECTED_TIME":
      return { ...state, selected: action.value };
    case "CURRENT_TIME":
      return { ...state, current: action.value };
    default:
      return state;
  }
}

const getDate = (y, m, d) => {
  let curTime = null;
  if (y === undefined || m === undefined || d === undefined) {
    curTime = new Date();
  } else {
    curTime = new Date(y, m, d);
  }
  let year = curTime.getFullYear();
  let month = curTime.getMonth();
  let day = curTime.getDate();
  let howManydays = new Date(year, month, 0).getDate();
  let firstDay = new Date(year, month, 1).getDay();
  return {
    year: year,
    month: month,
    today: day,
    hmDays: howManydays,
    fDay: firstDay
  };
};

const initialState = {
  selected: {
    year: null,
    month: null,
    today: null,
    hmDays: null,
    fDay: null
  },
  current: {
    year: null,
    month: null,
    today: null,
    hmDays: null,
    fDay: null
  }
};

const Calendar = () => {
  const [timeValue, dTimeValue] = useReducer(reducer, initialState);

  useEffect(() => {
    const time = getDate();
    dTimeValue({ type: "SELECTED_TIME", value: time });
    dTimeValue({ type: "CURRENT_TIME", value: time });
  }, []);

  const createDays = () => {
    let cells = [];
    let cnt = 1;
    for (let row = 0; row < 6; row++) {
      cells.push([]);
      for (let day = 0; day < 7; day++) {
        if (row === 0) {
          if (day >= timeValue.selected.fDay) {
            cells[row].push(cnt);
            cnt++;
          } else {
            cells[row].push(undefined);
          }
        } else {
          if (cnt <= timeValue.selected.hmDays) {
            cells[row].push(cnt);
            cnt++;
          } else {
            cells[row].push(undefined);
          }
        }
      }
    }
    return cells;
  };
  const printDays = () => {
    let cells = createDays();
    return cells.map((row, rIdx) => (
      <ul key={rIdx + "row"} className="days">
        {row.map((cell, cIdx) => (
          <li
            key={cIdx + "cell"}
            className={
              timeValue.selected.year === timeValue.current.year &&
              timeValue.selected.month === timeValue.current.month &&
              cell === timeValue.selected.today
                ? "its-today"
                : null
            }
          >
            {cell}
          </li>
        ))}
      </ul>
    ));
  };
  const cDateHdr = (flag) => {
    if (flag === "left") {
      const time = getDate(
        timeValue.selected.year,
        timeValue.selected.month - 1,
        timeValue.selected.today
      );
      dTimeValue({ type: "SELECTED_TIME", value: time });
    } else if (flag === "right") {
      const time = getDate(
        timeValue.selected.year,
        timeValue.selected.month + 1,
        timeValue.selected.today
      );
      dTimeValue({ type: "SELECTED_TIME", value: time });
    }
  };
  return (
    <div className="calendar-container">
      <div className="year-n-month-box">
        <span className="arrow left" onClick={() => cDateHdr("left")}>
          ❮
        </span>
        <span className="year-n-month">
          {timeValue.selected.year}년 {timeValue.selected.month + 1}월
        </span>
        <span className="arrow right" onClick={() => cDateHdr("right")}>
          ❯
        </span>
      </div>
      <ul className="day-label">
        <li>일</li>
        <li>월</li>
        <li>화</li>
        <li>수</li>
        <li>목</li>
        <li>금</li>
        <li>토</li>
      </ul>
      {printDays()}
    </div>
  );
};

export default Calendar;
