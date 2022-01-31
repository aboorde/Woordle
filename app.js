import { wordList, solutions } from "./words.js";

const analyzeWords = (guess, answer) => {
  return [...guess].reduce((prev, curr, idx) => {
    // 1: good char // good pos
    // 0: good char // bad pos
    // -1: bad char // bad pos
    let position;

    if (curr === answer.charAt(idx)) {
      position = 1;
    } else if ([...answer].includes(curr)) {
      position = 0;
    } else {
      position = -1;
    }

    prev.push(position);
    return prev;
  }, []);
};

const wordleSolver = (initStartingWord = "", initAnswer = "") => {
  let answer = initAnswer;
  let startingWord = initStartingWord;
  let manipulatedWordList = wordList;
  let guesses = 0;
  let correctGuess = false;
  let answerAnalyzed = ["", "", "", "", ""];
  let possibleLetters = [];
  let badLetters = [];

  if (!answer) {
    const answerIndex = Math.floor(Math.random() * solutions.length);
    answer = solutions[answerIndex]; // assign random answer if none passed in
  }

  if (!startingWord) {
    const startingWordIndex = Math.floor(
      Math.random() * manipulatedWordList.length
    );
    startingWord = manipulatedWordList[startingWordIndex]; // assign random starting word if none passed in
    manipulatedWordList = manipulatedWordList.filter(
      (manWord) => manWord !== startingWord
    );
  }

  console.log("answer:", answer);
  while (guesses < 6) {
    guesses++;
    let wordGuess = "";
    if (guesses === 1) {
      wordGuess = startingWord;
    } else {
      //guess word

      // Find words with exact positioning
      if (answerAnalyzed.some((elem) => elem !== "")) {
        answerAnalyzed.forEach((val, idx) => {
          if (val) {
            manipulatedWordList = manipulatedWordList.filter(
              (word) => word[idx] === val
            );
          }
        });
      }
      // Eliminate words with bad letters
      manipulatedWordList = manipulatedWordList.reduce((prev, curr, idx) => {
        if (![...curr].some((elem) => badLetters.includes(elem))) {
          prev.push(curr);
        }

        return prev;
      }, []);

      // Find words with correct letters
      if (possibleLetters.length) {
        manipulatedWordList = manipulatedWordList.reduce((prev, curr, idx) => {
          if (possibleLetters.every((letter) => [...curr].includes(letter))) {
            prev.push(curr);
          }
          return prev;
        }, []);
      }

      // Set Guess for loop
      const guessIndex = Math.floor(Math.random() * manipulatedWordList.length);
      wordGuess = manipulatedWordList[guessIndex];
      manipulatedWordList = manipulatedWordList.filter(
        (manWord) => manWord !== wordGuess
      );
    }

    console.log(wordGuess);
    const wordMatch = analyzeWords(wordGuess, answer);
    if (wordMatch.every((val) => val === 1)) {
      // if all letters match, GUESED CORRECTLY
      correctGuess = true;
      break;
    }

    wordMatch.forEach((val, idx) => {
      if (val === 1) {
        possibleLetters.push(wordGuess[idx]);
        answerAnalyzed[idx] = wordGuess[idx];
      }

      if (val === 0) {
        possibleLetters.push(wordGuess[idx]);
      }

      if (val === -1) {
        badLetters.push(wordGuess[idx]);
      }
    });
  }

  return [guesses, correctGuess];
};

const runner = () => {
  const runLimit = 1;
  let counter = 0;
  let numberOfGuesses = 0;
  let correctGuesses = 0;
  while (counter < runLimit) {
    const solution = wordleSolver("", "light");
    if (!isNaN(solution[0])) {
      numberOfGuesses = numberOfGuesses + solution[0];
    }
    if (solution[1] === true) {
      correctGuesses++;
    }
    counter++;
  }
  console.log("AVERAGE GUESSES: ", numberOfGuesses / runLimit);
  console.log("CORRECT GUESSES OUT OF ", runLimit, ": ", correctGuesses);
};

runner();
