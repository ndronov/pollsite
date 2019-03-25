(() => {
  const incrementAttr = attr =>
    attr.replace(/\d+/, index => ++index);

  const incrementAnswerIndex = answer => {
    const answerTitle = answer.querySelector('th');
    answerTitle.textContent = incrementAttr(answerTitle.textContent);
  };

  const clearAnswerText = answer => {
    const answerInput = answer.querySelector('input');
    answerInput.value = '';
    answerInput.name = incrementAttr(answerInput.name);
  };

  const findLastAnswer = () =>
    document.querySelector('tbody > tr:nth-last-child(2)');

  const addAnswer = e => {
    const lastAnswer = findLastAnswer();
    const newAnswer = lastAnswer.cloneNode(true);

    incrementAnswerIndex(newAnswer);
    clearAnswerText(newAnswer);
    lastAnswer.insertAdjacentElement('afterend', newAnswer);

    e.stopPropagation();
  };

  const removeAnswer = e => {
    if (e.target.classList.contains('btn--times')) {
      findLastAnswer().remove();
    }
  };

  const addHandlers = () => {
    const addAnswerButton = document.querySelector('button.btn--plus');
    const tbody = document.querySelector('tbody');

    addAnswerButton.addEventListener('click', addAnswer);
    tbody.addEventListener('click', removeAnswer);
  };

  document.addEventListener('DOMContentLoaded', addHandlers);
})();

