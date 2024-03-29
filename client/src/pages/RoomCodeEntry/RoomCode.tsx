import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';

import './RoomCode.css';
import { joinRoom } from '../../store/room';

let codeInputs: NodeListOf<HTMLInputElement>;
const CodeInput = () => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const dispatch = useDispatch();
  useEffect(() => {
    codeInputs = formRef.current?.querySelectorAll(
      '[data-room-input]'
    ) as NodeListOf<HTMLInputElement>;
  });

  const onChange = async () => {
    let code = getCode();
    if (code.length !== 6) {
      return;
    }
    dispatch(joinRoom(code));
  };

  const onInput = (e: React.FormEvent<HTMLFormElement | HTMLInputElement>) => {
    // Cursed type defination, but i know it works
    const { target } = e as React.ChangeEvent<HTMLInputElement>;
    if (!target.value.length) {
      return (target.value = '');
    }
    const inputLen = target.value.length;
    let currentIndex = Number(target.dataset.roomInput);

    if (inputLen > 1) {
      const inputValues = target.value.split('');
      inputValues.forEach((element: string, index: number) => {
        const nextValueIndex = currentIndex + index;
        if (nextValueIndex >= codeInputs.length) {
          return;
        }
        codeInputs[nextValueIndex].value = element;
      });
      currentIndex += inputValues.length - 2;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex < codeInputs.length) {
      codeInputs[nextIndex].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>): void => {
    const target = e.target as HTMLFormElement;
    const { code } = e;

    const currentIndex = Number(target.dataset.roomInput);
    const hasNextIndex = currentIndex + 1 < codeInputs.length;
    const hasPrevIndex = currentIndex - 1 >= 0;

    switch (code) {
      case 'ArrowLeft':
      case 'ArrowUp':
        if (hasPrevIndex) {
          codeInputs[currentIndex - 1].focus();
        }
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        if (hasNextIndex) {
          codeInputs[currentIndex + 1].focus();
        }
        e.preventDefault();
        break;
      case 'Backspace':
        if ((e.target as HTMLInputElement).value.length) {
          codeInputs[currentIndex].value = '';
        }
        if (hasPrevIndex) codeInputs[currentIndex - 1].focus();
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  const getCode = () => [...codeInputs].map(i => i.value).join('');

  return (
    <div className="code-input-container">
      <form
        ref={formRef}
        onChange={onChange}
        onInput={onInput}
        onKeyDown={handleKeyDown}
      >
        <input
          type="number"
          className="room-code-input"
          min="0"
          max="9"
          maxLength={1}
          data-room-input={0}
          placeholder="0"
          required
        ></input>
        <input
          type="number"
          className="room-code-input"
          min="0"
          max="9"
          maxLength={1}
          data-room-input={1}
          placeholder="0"
          required
        ></input>
        <input
          type="number"
          className="room-code-input"
          min="0"
          max="9"
          maxLength={1}
          data-room-input={2}
          placeholder="0"
          required
        ></input>
        <input
          type="number"
          className="room-code-input"
          min="0"
          max="9"
          maxLength={1}
          data-room-input={3}
          placeholder="0"
          required
        ></input>
        <input
          type="number"
          className="room-code-input"
          min="0"
          max="9"
          maxLength={1}
          data-room-input={4}
          placeholder="0"
          required
        ></input>
        <input
          type="number"
          className="room-code-input"
          min="0"
          max="9"
          maxLength={1}
          data-room-input={5}
          placeholder="0"
          required
        ></input>
      </form>
    </div>
  );
};

const RoomCode = () => {
  return (
    <div className="room-code-container">
      <h1 className="desktop">Join a room:</h1>
      <CodeInput />
    </div>
  );
};
export default RoomCode;
