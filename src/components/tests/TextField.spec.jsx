import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

describe('TextField', () => {
  describe('Placeholder', () => {
    it('기본 placeholder "텍스트를 입력해 주세요."가 노출된다', async () => {
      // Arrange - 테스트를 위한 환경 만들기
      // -> className을 지닌 컴포넌트 렌더링

      // render API를 호출하면 테스트 환경의 jsDOM에 리액트 컴포넌트가 렌더링된 DOM 구조가 반영됨
      // jsDOM: Node.js에서 사용하기 위해 많은 웹 표준을 순수 자바스크립트로 구현
      await render(<TextField />);

      // Act - 테스트할 동작 발생
      // -> 렌더링에 대한 검증이기 때문에 이 단계는 생략
      // -> 클릭이나 메서드 호출, prop 변경 등등에 대한 작업이 여기에 해당

      // Assert - 올바른 동작이 실행되었는지 검증
      // -> 렌더링 후 DOM에 해당 class가 존재하는지 검증

      // vitest의 expect 함수를 사용하여 기대 결과를 검증
      const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

      expect(textInput).toBeInTheDocument();
    });

    it('입력한 placeholder prop에 따라 placeholder가 변경된다', async () => {
      // Arrange - 테스트를 위한 환경 만들기
      // -> className을 지닌 컴포넌트 렌더링

      // render API를 호출하면 테스트 환경의 jsDOM에 리액트 컴포넌트가 렌더링된 DOM 구조가 반영됨
      // jsDOM: Node.js에서 사용하기 위해 많은 웹 표준을 순수 자바스크립트로 구현
      await render(<TextField placeholder="New Placeholder" />);

      // Act - 테스트할 동작 발생
      // -> 렌더링에 대한 검증이기 때문에 이 단계는 생략
      // -> 클릭이나 메서드 호출, prop 변경 등등에 대한 작업이 여기에 해당

      // Assert - 올바른 동작이 실행되었는지 검증
      // -> 렌더링 후 DOM에 해당 class가 존재하는지 검증

      // vitest의 expect 함수를 사용하여 기대 결과를 검증
      const textInput = screen.getByPlaceholderText('New Placeholder');

      expect(textInput).toBeInTheDocument();
    });
  });

  it('className prop으로 설정한 css class가 적용된다', async () => {
    // Arrange - 테스트를 위한 환경 만들기
    // -> className을 지닌 컴포넌트 렌더링

    // render API를 호출하면 테스트 환경의 jsDOM에 리액트 컴포넌트가 렌더링된 DOM 구조가 반영됨
    // jsDOM: Node.js에서 사용하기 위해 많은 웹 표준을 순수 자바스크립트로 구현
    await render(<TextField className="my-class" />);

    // Act - 테스트할 동작 발생
    // -> 렌더링에 대한 검증이기 때문에 이 단계는 생략
    // -> 클릭이나 메서드 호출, prop 변경 등등에 대한 작업이 여기에 해당

    // Assert - 올바른 동작이 실행되었는지 검증
    // -> 렌더링 후 DOM에 해당 class가 존재하는지 검증

    // vitest의 expect 함수를 사용하여 기대 결과를 검증
    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    expect(textInput).toHaveClass('my-class');
  });

  it('텍스트를 입력하면 onChange prop으로 등록한 함수가 호출된다.', async () => {
    // 스파이 함수
    // 스파이 함수: 테스트 코드에서 특정 함수가 호출되었는지, 함수의 인자로 어떤 것이 넘어왔는지, 어떤 값을 반환하는지 등 다양한 값을 저장
    const spy = vi.fn();
    const { user } = await render(<TextField onChange={spy} />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    await user.type(textInput, 'test');

    expect(spy).toHaveBeenCalledWith('test');
  });

  it('Enter키를 누르면 onEnter prop으로 등록한 함수가 호출된다.', async () => {
    // 스파이 함수
    // 스파이 함수: 테스트 코드에서 특정 함수가 호출되었는지, 함수의 인자로 어떤 것이 넘어왔는지, 어떤 값을 반환하는지 등 다양한 값을 저장
    const spy = vi.fn();
    const { user } = await render(<TextField onEnter={spy} />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    await user.type(textInput, 'test{Enter}');

    expect(spy).toHaveBeenCalledWith('test');
  });

  describe('포커스가 활성화되면 onFocus prop으로 등록한 함수가 호출된다.', () => {
    // 포커스 시키는 방법
    // 1. 인풋 요소를 클릭
    // 2. 탭키로 인풋 요소로 이동
    // 3. input.focus()로 직접 발생

    it('인풋 요소를 클릭하면 포커스가 활성화되고 onFocus prop으로 등록한 함수가 호출된다', async () => {
      const spy = vi.fn();
      const { user } = await render(
        <TextField onFocus={spy} placeholder="desired-input" />,
      );

      const textInput = screen.getByPlaceholderText('desired-input');

      await user.click(textInput);
      expect(spy).toHaveBeenCalled();
    });

    it('인풋 요소를 클릭하면 포커스가 활성화되고 border style이 추가된다', async () => {
      const { user } = await render(<TextField placeholder="desired-input" />);

      const textInput = screen.getByPlaceholderText('desired-input');

      await user.click(textInput);
      expect(textInput).toHaveStyle({
        borderWidth: 2,
        borderColor: 'rgb(25, 118, 210)',
      });
    });
  });
});
