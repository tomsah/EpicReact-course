// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React, {useState, useEffect} from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, selectSquare}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }
  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const InitializedArr = Array(9).fill(null)
  const [status, setStatus] = useState(null)
  const [history, setHistory] = useLocalStorageState('Game:history', [
    InitializedArr,
  ])
  const [currentStep, setCurrentStep] = useLocalStorageState('Game:step', 0)
  const [squares, setSquares] = useState(
    history.length > 1 ? history[currentStep] : InitializedArr,
  )
  const [nextValue, setNextValue] = useState(null)
  const [winner, setWinner] = useState(null)

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }

    if (history.length !== currentStep + 1) {
      const newHistory = history.splice(0, currentStep + 1)
      setHistory(newHistory)
    }

    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setHistory(prevState => [...prevState, squaresCopy])
    setSquares(squaresCopy)
    setCurrentStep(prevState => prevState + 1)
  }

  useEffect(() => {
    setStatus(calculateStatus(winner, squares, nextValue))
    setNextValue(calculateNextValue(squares))
    setWinner(calculateWinner(squares))
  }, [nextValue, setStatus, squares, winner])

  function restart() {
    setSquares(() => InitializedArr)
    setHistory(() => [InitializedArr])
    setCurrentStep(0)
  }

  const onSelectStep = index => {
    setSquares([...history[index]])
    setCurrentStep(index)
    setStatus(calculateStatus(winner, squares, nextValue))
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} selectSquare={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {history.map((step, i) => {
            return (
              <li key={`step-${i}`}>
                <button
                  onClick={() => onSelectStep(i)}
                  disabled={currentStep === i}
                >{`Go to ${i === 0 ? 'game start' : `move #${i}`} ${
                  i === history.length ? '(current)' : ''
                }`}</button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
