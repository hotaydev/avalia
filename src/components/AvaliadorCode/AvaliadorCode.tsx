import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";

export default function AvaliadorCode({ callback }: { callback?: Function }) {
  const [valueOne, setValueOne] = useState("");
  const [valueTwo, setValueTwo] = useState("");
  const [valueThree, setValueThree] = useState("");
  const [valueFour, setValueFour] = useState("");

  const inputOneRef = useRef<HTMLInputElement>(null);
  const inputTwoRef = useRef<HTMLInputElement>(null);
  const inputThreeRef = useRef<HTMLInputElement>(null);
  const inputFourRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    if (value.length > 1) newVal = value[value.length - 1];
    setState(newVal);

    if (nextInput?.current) {
      nextInput.current.focus();
    } else {
      buttonRef?.current?.focus();
    }
  };

  const onPaste = (e: any, position: number = 1) => {
    const pastedText = e.clipboardData.getData("Text");

    switch (position) {
      case 1:
        setValueOne(pastedText[0]);
        setValueTwo(pastedText[1]);
        setValueThree(pastedText[2]);
        setValueFour(pastedText[3]);
        break;

      case 2:
        setValueTwo(pastedText[1]);
        setValueThree(pastedText[2]);
        setValueFour(pastedText[3]);
        break;
      case 3:
        setValueThree(pastedText[2]);
        setValueFour(pastedText[3]);
        break;
      case 4:
        setValueFour(pastedText[3]);
        break;
    }

    buttonRef?.current?.focus();
  };

  // TODO: the paste event is not fully working, it changes the first value with the latest value

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
              onPaste={onPaste}
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
              onPaste={onPaste}
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
              onPaste={onPaste}
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
                })
              }
              onPaste={onPaste}
              ref={inputFourRef}
            />
          </div>
        </div>

        <div className="flex flex-col px-4 justify-center items-center">
          <button
            className="text-center w-3/4 rounded-xl outline-none py-4 bg-blue-600 hover:bg-blue-700 transition-all border-none text-white text-sm disabled:bg-gray-400 disabled:hover:bg-gray-500 disabled:cursor-not-allowed"
            disabled={
              !(!!valueOne && !!valueTwo && !!valueThree && !!valueFour)
            }
            onClick={() => {
              if (!(!!valueOne && !!valueTwo && !!valueThree && !!valueFour))
                return;
              if (callback)
                callback(`${valueOne}${valueTwo}${valueThree}${valueFour}`);
            }}
            ref={buttonRef}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
