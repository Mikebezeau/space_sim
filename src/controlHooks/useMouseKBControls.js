import { useRef, useEffect } from "react";

export function useMouseMove(callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleMouseMove(e) {
      callbackRef.current(e);
    }

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
}

export function useMouseClick(callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleMouseClick(e) {
      callbackRef.current(e);
    }

    document.addEventListener("click", handleMouseClick);

    return () => {
      document.removeEventListener("click", handleMouseClick);
    };
  }, []);
}

export function useMouseRightClick(callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleMouseRightClick(e) {
      e.preventDefault();
      callbackRef.current(e);
    }

    document.addEventListener("contextmenu", handleMouseRightClick);

    return () => {
      document.removeEventListener("contextmenu", handleMouseRightClick);
    };
  }, []);
}

export function useMouseDown(callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleMouseDown(e) {
      callbackRef.current(e);
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);
}

export function useMouseUp(callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleMouseUp(e) {
      callbackRef.current(e);
    }

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
}

export function useKBControls(keyCode, callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    function handleKeyDown({ code }) {
      //console.log("code:", code);
      if (keyCode === code) {
        callbackRef.current(code);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    //document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      //document.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyCode]);
}
