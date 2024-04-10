type ButtonElement = HTMLButtonElement | null;

const countdownFn = (time: number, getVerifyCodeBtnEl: ButtonElement, isDisabled: { value: boolean }) => {
  isDisabled.value = true;
  fn(time);
  function fn(time: number) {
    if (getVerifyCodeBtnEl) {
      getVerifyCodeBtnEl.textContent = `${time}秒后重发`;
      setTimeout(() => {
        if (time > 1) fn(time - 1);
        else {
          getVerifyCodeBtnEl.textContent = "获取验证码";
          isDisabled.value = false;
        }
      }, 1000);
    }
  }
};

export default countdownFn;
