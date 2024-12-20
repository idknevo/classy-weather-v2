import { getWeatherIcon, formatDay } from "../util/helpers";
export default function Weather({ weather, location }) {
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = weather;
  return (
    <div>
      <h2>Weather in {location}</h2>
      <ul className="weather">
        {dates.map((date, i) => (
          <Day
            date={date}
            code={codes.at(i)}
            min={min.at(i)}
            max={max.at(i)}
            isToday={i === 0}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
}

function Day({ date, code, min, max, isToday }) {
  return (
    <li className="day">
      <span>{getWeatherIcon(code)}</span>
      <p>{isToday ? "today" : formatDay(date)}</p>
      <p>
        {Math.floor(min)}&deg; &mdash; <strong>{Math.ceil(max)}&deg;</strong>
      </p>
    </li>
  );
}
