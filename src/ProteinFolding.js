import { useState, useRef, useEffect } from 'react';
import {Stage, Layer, Circle} from 'react-konva';

const stageWidth = window.innerWidth * 0.7;
const stageHeight = window.innerHeight * 0.8;

const initialCellRadius = 20;
const initialNumberOfCells = 15;

const initialP = 0.1;
const iterationDelayMs = 10;
const maxAttemptsToMoveCellRandomly = 10;

function calculateCellEnergy(cell1, cell2) {
  let xDistance = Math.pow((cell1.x - cell2.x), 2);
  let yDistance = Math.pow((cell1.y - cell2.y), 2);
  let totalDist = Math.sqrt(xDistance + yDistance);

  let energy = 1 / Math.pow(totalDist, 12) - 1 / Math.pow(totalDist, 6);
  energy = Math.pow(10, 10) * 4.0 * energy;

  return energy;
}

function calculateTotalEnergy(cells) {
  let totalEnergy = 0.0;

  for (let i = 0; i < cells.length - 1; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      totalEnergy += calculateCellEnergy(cells[i], cells[j]);
    }
  }

  return totalEnergy;
}

function isValidCellPosition(cells, randX, randY, cellId, cellRadius) {
  let cellIntersectsExisting = false;

  for (let i = 0; i < cells.length; i++) {
    if (i === cellId) {
      continue;
    }

    let xDistance = (cells[i].x - randX) * (cells[i].x - randX);
    let yDistance = (cells[i].y - randY) * (cells[i].y - randY);

    if (xDistance + yDistance <= 4.0 * cellRadius * cellRadius) {
      cellIntersectsExisting = true;
      break;
    }
  }

  let cellIntersectsStageBoudaries = false;

  if (randX - cellRadius < 0.0 || randX + cellRadius > stageWidth) {
    cellIntersectsStageBoudaries = true;
  }

  if (randY - cellRadius < 0.0 || randY + cellRadius > stageHeight) {
    cellIntersectsStageBoudaries = true;
  }

  return !cellIntersectsExisting && !cellIntersectsStageBoudaries;
}

function generateCells(numOfCells, cellRadius) {
  let cells = [];
  let numOfGeneratedCells = 0;

  while (numOfGeneratedCells < numOfCells) {
    let randX = Math.random() * stageWidth;
    let randY = Math.random() * stageHeight;
    let generatedCircleId = numOfGeneratedCells + 1;

    if (isValidCellPosition(cells, randX, randY, generatedCircleId, cellRadius)) {
      cells.push({ id: numOfGeneratedCells.toString(), x: randX, y: randY, color: 'red' });
      numOfGeneratedCells += 1;
    }
  }

  return cells;
}

function ProteinFolding() {
  const [cellRadius, setCellRadius] = useState(initialCellRadius);
  const [cellsCount, setCellsCount] = useState(initialNumberOfCells);
  const [cells, setCells] = useState(generateCells(cellsCount, cellRadius));
  
  const [p, setP] = useState(initialP);

  const [totalEnergy, setTotalEnergy] = useState(calculateTotalEnergy(cells));
  const [minTotalEnergy, setMinTotalEnergy] = useState(0.0);
  const intervalRef = useRef(null);

  function startProteingFolding() {
    intervalRef.current = setInterval(() => {
      moveCellsRandomly();
    }, iterationDelayMs);
  }

  function pauseProteinFolding() {
    clearInterval(intervalRef.current);
  }

  function generateNewCells() {
    clearInterval(intervalRef.current);

    let currentCircleRadius = document.getElementById('cell-radius').value;
    let currentCirclesCount = document.getElementById('cells-count').value;
    let currentP = document.getElementById('cell-move-probability').value;

    setCellRadius(currentCircleRadius);
    setCellsCount(currentCirclesCount);
    setP(currentP);

    setCells(generateCells(currentCirclesCount, currentCircleRadius));
    setTotalEnergy(calculateTotalEnergy(cells));
    setMinTotalEnergy(0.0);
  }

  function moveCellsRandomly() {
    let cellsCopy = JSON.parse(JSON.stringify(cells));

    cellsCopy.map((cell) => {
      let cellIsMoved = false;
      let numAttempsToMove = 0;
      let currentX = cell.x;
      let currentY = cell.y;

      while (!cellIsMoved && numAttempsToMove < maxAttemptsToMoveCellRandomly) {
        let randX = cell.x + (Math.random() - 0.5) * 10;
        let randY = cell.y + (Math.random() - 0.5) * 10;
        let currentCellId = Number(cell.id);

        if (isValidCellPosition(cellsCopy, randX, randY, currentCellId, cellRadius)) {
          cell.x = randX;
          cell.y = randY;
          cellIsMoved = true;
        }

        numAttempsToMove += 1;
      }

      if (calculateTotalEnergy(cellsCopy) > calculateTotalEnergy(cells)
          && Math.random() < 1 - p
      ) {
        cell.x = currentX;
        cell.y = currentY;
      }
      
      return cell;
    });

    for (let i = 0; i < cells.length; i++) {
      cells[i] = cellsCopy[i];
    }

    setCells(cells);
    setTotalEnergy(calculateTotalEnergy(cells));
  };

  useEffect(() => {
    if (totalEnergy < minTotalEnergy) {
      setMinTotalEnergy(totalEnergy);
    }
  }, [totalEnergy, minTotalEnergy]);

  return (
    <>
      <h1>Эксперимент по сворачиванию белка</h1>
      
      <div className='params-container'>
        <label>Радиус частицы: </label>
        <input id='cell-radius' type='number' defaultValue={initialCellRadius}/>
        <br/><br/>

        <label>Количество частиц: </label>
        <input id='cells-count' type='number' defaultValue={initialNumberOfCells}/>
        <br/><br/>

        <label>P: </label>
        <input id='cell-move-probability' type='number' defaultValue={initialP}></input>
        <br/><br/>

        <button onClick={generateNewCells}>Обновить</button>

        <br/>
        <hr></hr>

        <button onClick={startProteingFolding}>Старт</button>
        <button onClick={pauseProteinFolding}>Пауза</button>

        <br/>

        <p>Минимальная энергия взаимодействия: {minTotalEnergy.toFixed(2)}</p>
        <p>Текущая энергия взаимодействия: {totalEnergy.toFixed(2)}</p>
      </div> 

      <div className='protein-stage'>
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            {cells.map((circle) => (
              <Circle
                key={circle.id}
                id={circle.id}
                x={circle.x}
                y={circle.y}
                radius={cellRadius}
                fill={circle.color}
              />
            ))}
          </Layer>
        </Stage>
      </div>

    </>
  );
}

export default ProteinFolding;
