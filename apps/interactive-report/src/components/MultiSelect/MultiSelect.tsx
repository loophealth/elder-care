import { useEffect, useState } from "react";

import "./MultiSelect.css";

interface MultiSelectInterface {
  id: string;
  data: string[];
  onChange?: (val: string[]) => void;
  multiple?: boolean;
  value: string[] | [];
  required?: boolean;
  name?: string;
}

export const MultiSelect = ({
  data,
  onChange,
  multiple = true,
  value = [],
  required,
  name,
}: MultiSelectInterface) => {
  const [values, setValues] = useState<string[]>(value);

  useEffect(() => {
    setValues(value);
  }, [value]);

  const logValue = (e: any) => {
    const currentVal = e.target.value;
    let val = [...values];
    const valIndex = val?.indexOf(currentVal);
    if (valIndex === -1) {
      if (!multiple) {
        val = [];
      }
      val.push(currentVal);
      setValues(val);
    } else {
      val?.splice(valIndex, 1);
      setValues(val);
    }
    onChange && onChange(val);
  };

  return (
    <div className="checkbox-group" id="multi_select">
      {data.map((item, index) => (
        <div className="checkbox" key={index.toString()}>
          <label className="checkbox-wrapper">
            <input
              name={name}
              type="checkbox"
              className="checkbox-input"
              value={item}
              onChange={logValue}
              checked={values.indexOf(item) !== -1}
              required={required && values.length <= 0 ? true : false}
            />
            <span className="checkbox-tile">
              <span className="checkbox-label">{item}</span>
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};
