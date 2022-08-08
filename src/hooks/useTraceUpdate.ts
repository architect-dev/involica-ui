import { isEqual } from "lodash";
import { useRef, useEffect } from "react";
/* eslint-disable no-prototype-builtins */

export const getObjectDiff = (obj1, obj2) => {
  const diff = Object.keys(obj1).reduce((result, key) => {
      if (!obj2.hasOwnProperty(key)) {
          result.push(key);
      } else if (isEqual(obj1[key], obj2[key])) {
          const resultKeyIndex = result.indexOf(key);
          result.splice(resultKeyIndex, 1);
      }
      return result;
  }, Object.keys(obj2));

  return diff;
}

export const useTraceUpdate = (props) => {
    const prev = useRef(props);
    useEffect(() => {
      const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
        if (prev.current[k] !== v && typeof v === 'object' && typeof prev.current[k] === 'object') {
          console.log({
            [k]: getObjectDiff(prev.current[k], v),
          })
        }
        if (prev.current[k] !== v) {
          return {
            ...ps,
            [k]: [prev.current[k], v]
          }
        }
        return ps;
      }, {});
      if (Object.keys(changedProps).length > 0) {
        console.log('Changed props:', changedProps);
      }
      prev.current = props;
    });
  }