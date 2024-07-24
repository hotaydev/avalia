import {
  type ClipboardEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

export default function AvaliadorCode({ callback }: Readonly<{ callback?: (code: string) => void }>) {
  const [valueOne, setValueOne] = useState("");
  const [valueTwo, setValueTwo] = useState("");
  const [valueThree, setValueThree] = useState("");
  const [valueFour, setValueFour] = useState("");

  const inputOneRef = useRef<HTMLInputElement>(null);
  const inputTwoRef = useRef<HTMLInputElement>(null);
  const inputThreeRef = useRef<HTMLInputElement>(null);
  const inputFourRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.code === "Enter") {
        buttonRef?.current?.click();
        event.preventDefault();
      }
    }
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  const handleInput = ({
    value,
    nextInput,
    setState,
  }: {
    value: string;
    nextInput?: RefObject<HTMLInputElement>;
    setState: Dispatch<SetStateAction<string>>;
  }) => {
    let newVal = value;
    if (value.length > 1) {
      newVal = value[value.length - 1];
    }
    setState(newVal);

    if (nextInput?.current) {
      nextInput.current.focus();
    } else {
      inputFourRef?.current?.blur();
      buttonRef?.current?.focus();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>, position: number) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("Text").slice(0, 4);

    if (pastedText.length === 4) {
      setValues(pastedText.split(""));
    } else {
      const newValues = [valueOne, valueTwo, valueThree, valueFour];
      for (let i = 0; i < pastedText.length; i++) {
        if (position - 1 + i < newValues.length) {
          newValues[position - 1 + i] = pastedText[i];
        }
      }
      setValues(newValues);

      if (position + pastedText.length - 1 < 4) {
        switch (position + pastedText.length - 1) {
          case 1:
            inputTwoRef.current?.focus();
            break;
          case 2:
            inputThreeRef.current?.focus();
            break;
          case 3:
            inputFourRef.current?.focus();
            break;
          default:
            buttonRef?.current?.focus();
            break;
        }
      }
    }
    buttonRef?.current?.focus();
  };

  const setValues = (newValues: string[]) => {
    setValueOne(newValues[0]);
    setValueTwo(newValues[1]);
    setValueThree(newValues[2]);
    setValueFour(newValues[3]);
  };

  const sendButton = () => {
    if (!(!!valueOne && !!valueTwo && !!valueThree && !!valueFour) && callback) {
      callback(`${valueOne}${valueTwo}${valueThree}${valueFour}`);
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
          <div className="w-16 h-16 ">
            <input
              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="text"
              value={valueOne}
              onChange={(e) =>
                handleInput({
                  value: e.target.value,
                  setState: setValueOne,
                  nextInput: inputTwoRef,
                })
              }
              onPaste={(e) => onPaste(e, 1)}
              ref={inputOneRef}
            />
          </div>
          <div className="w-16 h-16 ">
            <input
              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="text"
              value={valueTwo}
              onChange={(e) =>
                handleInput({
                  value: e.target.value,
                  setState: setValueTwo,
                  nextInput: inputThreeRef,
                })
              }
              onPaste={(e) => onPaste(e, 2)}
              ref={inputTwoRef}
            />
          </div>
          <div className="w-16 h-16 ">
            <input
              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="text"
              value={valueThree}
              onChange={(e) =>
                handleInput({
                  value: e.target.value,
                  setState: setValueThree,
                  nextInput: inputFourRef,
                })
              }
              onPaste={(e) => onPaste(e, 3)}
              ref={inputThreeRef}
            />
          </div>
          <div className="w-16 h-16 ">
            <input
              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
              type="text"
              value={valueFour}
              onChange={(e) =>
                handleInput({
                  value: e.target.value,
                  setState: setValueFour,
                  nextInput: undefined,
                })
              }
              onPaste={(e) => onPaste(e, 4)}
              ref={inputFourRef}
            />
          </div>
        </div>

        <div className="flex flex-col px-4 justify-center items-center">
          <button
            className="text-center w-3/4 rounded-xl outline-none py-4 bg-blue-600 hover:bg-blue-700 transition-all border-none text-white text-sm disabled:bg-gray-400 disabled:hover:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-blue-300"
            disabled={!(!!valueOne && !!valueTwo && !!valueThree && !!valueFour)}
            onClick={sendButton}
            ref={buttonRef}
            type="button"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
