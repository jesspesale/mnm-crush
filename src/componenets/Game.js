import { useEffect, useState } from "react"
import blueMnm from "../images/blue_mnm.png"
import redMnm from "../images/red_mnm.png"
import orangeMnm from "../images/orange_mnm.png"
import yellowMnm from "../images/yellow_mnm.png"
import pinkMnm from "../images/pink_mnm.png"
import greenMnm from "../images/green_mnm.png"
import blank from "../images/blank.png"
import '../App.css';

const width = 8

const candyColors = [
  blueMnm, 
  redMnm, 
  orangeMnm,
  yellowMnm,
  pinkMnm,
  greenMnm
]

const Game = ({score, turns, setTurns, setScore}) => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)

  const checkForColumnOfFour = () => {
    for(let i = 0; i <= 39; i++){
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if(columnOfFour.every(square => currentColorArrangement[square] === decidedColor) && !isBlank){
        setScore((score) => score + 4)
          columnOfFour.forEach(square => currentColorArrangement[square] = blank)
          return true
      }
    }
  }


    const checkForRowOfFour = () => {
      for(let i = 0; i < 64; i++){
        const rowOfFour = [i, i + 1, i + 2, i + 3]
        const decidedColor = currentColorArrangement[i]
        const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64]
        const isBlank = currentColorArrangement[i] === blank

        if(notValid.includes(i)) continue
          //if in our loop we hit a not valid number just continue
        
        if(rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)){
            setScore((score) => score + 4)
            rowOfFour.forEach(square => currentColorArrangement[square] = blank)
            return true
        }
      }
    }
    
  const checkForColumnOfThree = () => {
    for(let i = 0; i <= 47; i++){
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if(columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)){
        setScore((score) => score + 3)
        // checking if 3 columns in a row are the same color as the first one checked
          columnOfThree.forEach(square => currentColorArrangement[square] = blank)
          return true
      }
    }
  }

    const checkForRowOfThree = () => {
      for(let i = 0; i < 64; i++){
        const rowOfThree = [i, i + 1, i + 2]
        const decidedColor = currentColorArrangement[i]
        const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]
        const isBlank = currentColorArrangement[i] === blank

        if(notValid.includes(i)) continue
          //if in our loop we hit a not valid number just continue
        
        if(rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)){
          setScore((score) => score + 3)
          // checking if 3 columns in a row are the same color as the first one checked
            rowOfThree.forEach(square => currentColorArrangement[square] = blank)
            return true
        }
      }
    }

    const moveIntoSquareBelow = () => {
      for(let i =0; i <= 55; i++){

        const firstRow = [0,1,2,3,4,5,6,7]
        const isFirstRow = firstRow.includes(i)

        if(isFirstRow && currentColorArrangement[i] == blank){
          let randomNumber = Math.floor(Math.random() * candyColors.length)
          currentColorArrangement[i] = candyColors[randomNumber]
        }


        if (currentColorArrangement[i + width] === blank){
          currentColorArrangement[i + width] = currentColorArrangement[i]
          currentColorArrangement[i] = blank
        }
      }
    }

    const dragStart = (e) => {
      setSquareBeingDragged(e.target)
    }

    const dragDrop = (e) => {
      setSquareBeingReplaced(e.target)
    }

    const dragEnd = (e) => {

      const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))
      const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))

      currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
      currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)

        const isAColumnOfFour = checkForColumnOfFour()
        const isARowOfFour = checkForRowOfFour()
        const isAColumnOfThree = checkForColumnOfThree()
        const isARowOfThree = checkForRowOfThree()

        if (squareBeingReplacedId &&
            validMove &&
            (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
            setSquareBeingDragged(null)
            setSquareBeingReplaced(null)
             setTurns((turns) => turns + 1)
        } else {
            currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
            currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            setCurrentColorArrangement([...currentColorArrangement])
        }
    }

  const createBoard = () => {
    const randomColorArrangement = []

    for(let i = 0; i < width * width; i++){
      const randomNumber = Math.floor(Math.random() * candyColors.length)
      // floor for rounded up on numbers, choose a random number that is 1-8
      const randomColor = candyColors[randomNumber]
        randomColorArrangement.push(randomColor)
    }
    setCurrentColorArrangement(randomColorArrangement)
    
  }

    useEffect(() => {
      createBoard()
    }, [])
  // the empty array makes it so the effect will only run once after state changes

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowOfFour()
      checkForColumnOfThree()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setCurrentColorArrangement([...currentColorArrangement])
    }, 100)
    // run a new interval every 100ms
    return () => clearInterval(timer)
  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement])

  return (
    <div>
      <div className="game">
         {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))} 
      </div>
        <br></br>
    </div>
  )

}

export default Game