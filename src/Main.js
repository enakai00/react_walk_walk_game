import React, { useRef, useState, useEffect } from "react";
import { GameBackend, getScreen, sleep, randInt, clearScreen, print }
       from "./components/GameBackend";


// Your code here!
const game = async (screen, refresh, keyPress) => {
  // Global game variables.
  const bike = {x: 0, y: 0, direction: 0, score: 0}
  const bikeChar = ["┻", "┣", "┳", "┫"]
  const dirVector = [[0, -1], [1, 0], [0, 1], [-1, 0]] // [dx, dy]

  const initGame = async () => {
    // Initialize bike status.
    bike.x = 20;
    bike.y = 13;
    bike.direction = 0;
    bike.score = 0;

    // Draw start screen.
    clearScreen(screen);
    print(screen, 4, 0, "SCORE: " + bike.score.toString());
    print(screen, 0, 1, " ".repeat(40), "white", "white");
    for (let y = 2; y < 23; y++) {
      print(screen, 0, y, " ", "white", "white");
      print(screen, 39, y, " ", "white", "white");
    }
    print(screen, 0, 23, " ".repeat(40), "white", "white");
    print(screen, bike.x-1, bike.y-2, "[I]");
    print(screen, bike.x-4, bike.y, "[J] " + bikeChar[bike.direction] + " [L]");
    print(screen, bike.x-1, bike.y+2, "[M]");
    print(screen, 13, 8, "HIT [S] TO START");
    refresh();
    while (true) {
      if (keyPress["s"]) {
        break;
      }
      await sleep(100);
    }
    clearScreen(screen);
    print(screen, 0, 1, " ".repeat(40), "white", "white");
    for (let y = 2; y < 23; y++) {
      print(screen, 0, y, " ", "white", "white");
      print(screen, 39, y, " ", "white", "white");
    }
    print(screen, 0, 23, " ".repeat(40), "white", "white");
  }

  const gameover = async () => {
    print(screen, 15, 10, " GAME OVER ", "black", "white");
    await refresh();
    await sleep(5000);
  }

  const moveBike = async () => {
    if (keyPress["i"]) {
      bike.direction = 0;
    }
    if (keyPress["l"]) {
      bike.direction = 1;
    }
    if (keyPress["m"]) {
      bike.direction = 2;
    }
    if (keyPress["j"]) {
      bike.direction = 3;
    }
    print(screen, bike.x, bike.y, " ", "blue", "blue");
    bike.x += dirVector[bike.direction][0];
    bike.y += dirVector[bike.direction][1];
    const nextCell = screen[bike.y][bike.x].char;
    if (nextCell !== "") {
      print(screen, bike.x, bike.y, "*", "black", "red");
      finished = true;
    } else {
      print(screen, bike.x, bike.y, bikeChar[bike.direction]);
      bike.score += 1;
    }
    print(screen, 4, 0, "SCORE: " + bike.score.toString());
  }

  const putBlock = async () => {
    const x = randInt(1, 39);
    const y = randInt(2, 22);
    if (randInt(0, 2) === 0) {
      print(screen, x, y, " ", "yellow", "yellow");
    }
  }

  // main loop
  var finished;
  while (true) {
    finished = false;
    await initGame();
    while (!finished) {
      await moveBike();
      await putBlock();
      await refresh();
      await sleep(100);
    }
    await gameover();
  }
}


export const Main = (props) => {
  // Define keys used in the game.
  const keys = ["s", "i", "j", "l", "m"];

  // The following part is a fixed boilarplate. Just leave as is.
  const xSize = 40;
  const ySize = 24;
  const screenRef = useRef(getScreen(xSize, ySize));
  const screen = screenRef.current;
  const keyPressRef = useRef({});
  const keyPress = keyPressRef.current;
  // eslint-disable-next-line
  const [dummyState, setDummyState] = useState([]);
  const refresh = () => { setDummyState([]); }

  useEffect(
    () => {game(screen, refresh, keyPress)}, [screen, keyPress]
  );

  const element = (
    <GameBackend keys={keys} keyPress={keyPress} screen={screen}/>
  );

  return element;
}
