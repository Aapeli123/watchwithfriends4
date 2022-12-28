import React, { useEffect, useRef } from 'react';
import './modal.css';

const Prompt = (props: {
  question: string;
  closable: boolean;
  show: boolean;
  callback: (res: string) => any;
  close?: () => any;
}) => {
  const textRef = useRef<HTMLInputElement>(null);
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = textRef.current?.value;
    if (username === undefined) {
      props.callback('');
    }
    props.callback(username as string);
  };

  useEffect(() => {
    textRef.current?.focus();
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key == 'Escape') {
      e.preventDefault();
      if (props.closable) {
        if (props.close !== undefined) props.close();
      }
    }
  };

  return props.show ? (
    <div className="modal">
      <div className="modal-content">
        <h2>{props.question}</h2>
        <form onKeyDown={onKeyDown} onSubmit={onFormSubmit}>
          <input ref={textRef} type="text" />
          <input type="submit" value={'✓'} />
        </form>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Prompt;
