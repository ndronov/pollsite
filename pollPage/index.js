(() => {
  let poll = {};

  const getPollData = () =>
    fetch('/poll/' + poll.id);

  const getPollResults = () =>
    fetch('/results/' + poll.id);

  const findLastOption = () =>
    document.querySelector('form.poll label:last-child');

  const setOptionAttrs = (element, answer) => {
    element.querySelector('input').value = answer;
    element.append(answer);
  };

  const setResultRowData = (trElement, result) => {
    let nameTd = trElement.querySelector('td').cloneNode();

    nameTd.textContent = result.name;
    trElement.textContent = '';
    trElement.append(nameTd);

    poll.data.answers.forEach(answer => {
      let td = nameTd.cloneNode();
      td.textContent = answer === result.answer ? 'x' : '';
      trElement.append(td);
    });
  };

  const renderPollResults = () => {
    // columns captions
    const captionsRow = document.querySelector('thead tr');
    const nameTh = captionsRow.querySelector('th');

    poll.data.answers.forEach(answer => {
      let th = nameTh.cloneNode();
      th.textContent = answer;
      captionsRow.append(th);
    });

    // users voting resuts
    let newResultRow;
    let resultRow = document.querySelector('tbody tr');
    let nameTd = resultRow.querySelector('td');

    if (poll.results.length < 1) return;
    setResultRowData(resultRow, poll.results[0]);

    for (let i = 1 ; i < poll.results.length; i++) {
      newResultRow = resultRow.cloneNode(true);
      setResultRowData(newResultRow, poll.results[i]);
      resultRow.insertAdjacentElement('afterend', newResultRow);
      resultRow = newResultRow;
    }
  };

  const renderPollData = () => {
    // question text
    document.querySelector('form.poll h1').textContent = poll.data.question;

    // answer options
    let newOption;
    let option = findLastOption();
    const emptyOption = option.cloneNode(true);
    setOptionAttrs(option, poll.data.answers[0]);

    for (let i = 1 ; i < poll.data.answers.length; i++) {
      newOption = emptyOption.cloneNode(true);
      setOptionAttrs(newOption, poll.data.answers[i]);
      option.insertAdjacentElement('afterend', newOption);
      option = newOption;
    }
  };

  const injectPollId = () => {
    document.forms.poll.pollId.value = poll.id;
  };

  const getCookie = name => {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : null;
  };

  const getVotedPolls = () => {
    const votedString = getCookie('voted');
    return votedString ? JSON.parse(votedString) : [];
  };

  const addPollToCookie = () => {
    const voted = getVotedPolls();
    voted.push(poll.id);
    document.cookie = 'voted=' + JSON.stringify(voted);
  };

  const haveVoted = () =>
    getVotedPolls().indexOf(poll.id) > -1;

  const isFormValid = () =>
    document.forms.poll.name.value !== '' && document.forms.poll.answer.value !== '';

  const submit = e => {
    if (!isFormValid()) return;

    e.preventDefault();
    addPollToCookie();
    document.forms.poll.submit();
  };

  const findSubmitButton = () =>
    document.forms.poll.submitButton;

  const disableVoting = () => {
    const submitButton = findSubmitButton();
    submitButton.disabled = true;
    submitButton.title = 'You have already voted';

    document.forms.poll.name.disabled = true;

    for (let i = 0; i < document.forms.poll.answer.length; i++) {
      document.forms.poll.answer[i].disabled = true;
    }
  };

  const addSubmitHandler = () => {
    if (haveVoted()) return disableVoting();

    findSubmitButton().addEventListener('click', submit);
  };

  const main = () => {
    poll.id = window.location.pathname.slice(1);

    Promise.all([getPollData(), getPollResults()])
      .then(res => Promise.all([res[0].json(), res[1].json()]))
        .then(res => {
          poll.data = res[0];
          poll.results = res[1];

          renderPollData();
          renderPollResults();
          injectPollId();
          addSubmitHandler();
        });
  };

  document.addEventListener('DOMContentLoaded', main);
})();
