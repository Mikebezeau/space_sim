import { useRef, useEffect } from "react";
import { IS_MOBLIE } from "../util/constants";

export function useTouchStartControls(elementID, callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleTouchStart() {
      callbackRef.current();
    }

    if (IS_MOBLIE)
      document
        .getElementById(elementID)
        .addEventListener("touchstart", handleTouchStart);
    //document.addEventListener("keyup", handleKeyUp);

    return (elementID) => {
      if (document.getElementById(elementID))
        document
          .getElementById(elementID)
          .removeEventListener("touchstart", handleTouchStart);
      //document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
}

export function useTouchMoveControls(elementID, callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleTouchMove(event) {
      callbackRef.current(event);
    }

    if (IS_MOBLIE)
      document
        .getElementById(elementID)
        .addEventListener("touchmove", handleTouchMove);
    //document.addEventListener("keyup", handleKeyUp);

    return (elementID) => {
      if (document.getElementById(elementID))
        document
          .getElementById(elementID)
          .removeEventListener("touchmove", handleTouchMove);
      //document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
}

export function useTouchEndControls(elementID, callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleTouchEnd(event) {
      callbackRef.current(event);
    }

    if (IS_MOBLIE)
      document
        .getElementById(elementID)
        .addEventListener("touchend", handleTouchEnd);
    //document.addEventListener("keyup", handleKeyUp);

    return (elementID) => {
      if (document.getElementById(elementID))
        document
          .getElementById(elementID)
          .removeEventListener("touchend", handleTouchEnd);
      //document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
}
