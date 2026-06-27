"use client";
import { useState, useEffect, useRef } from "react";
import CodeExplanationPanel from "./CodeExplanationPanel";

const generateArray = (size = 10) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export default function BubbleSortAnimation() {
  const [array, setArray] = useState(generateArray());
  const [currentI, setCurrentI] = useState(0);
  const [currentJ, setCurrentJ] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const [sorted, setSorted] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [speed, setSpeed] = useState(400);
  const stopRef = useRef(false);

  const resetArray = () => {
    stopRef.current = true;
    setIsSorting(false);
    setSorted([]);
    setComparing([]);
    setCurrentI(0);
    setCurrentJ(0);
    setCurrentStep(0);
    setTimeout(() => {
      stopRef.current = false;
      setArray(generateArray());
    }, 100);
  };

  const bubbleSort = async () => {
    setIsSorting(true);
    stopRef.current = false;
    const arr = [...array];
    const n = arr.length;
    const sortedIndices = [];

    for (let i = 0; i < n - 1; i++) {
      setCurrentI(i);
      setCurrentStep(0); // outer loop line

      for (let j = 0; j < n - i - 1; j++) {
        if (stopRef.current) return;

        setCurrentJ(j);
        setCurrentStep(1); // inner loop line
        setComparing([j, j + 1]);
        setArray([...arr]);
        await sleep(speed);

        setCurrentStep(2); // if condition
        await sleep(speed / 2);

        if (arr[j] > arr[j + 1]) {
          setCurrentStep(3); // swap line
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(speed);
        }

        setCurrentStep(4);
      }

      sortedIndices.push(n - 1 - i);
      setSorted([...sortedIndices]);
      setCurrentStep(5); // inner loop ends
    }

    sortedIndices.push(0);
    setSorted([...sortedIndices]);
    setComparing([]);
    setCurrentStep(6); // done
    setIsSorting(false);
  };

  const maxVal = Math.max(...array);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-purple-400 mb-2">Bubble Sort Visualizer</h1>
      <p className="text-gray-400 mb-6 text-sm text-center max-w-lg">
        Watch how Bubble Sort compares adjacent elements and swaps them until the array is sorted.
      </p>

      {/* Array Bars */}
      <div className="flex items-end gap-1 h-48 mb-6 bg-[#1a1a2e] px-4 py-3 rounded-xl border border-purple-800 w-full max-w-2xl justify-center">
        {array.map((val, idx) => {
          const isSortedBar = sorted.includes(idx);
          const isComparing = comparing.includes(idx);
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{val}</span>
              <div
                style={{ height: `${(val / maxVal) * 140}px`, width: "28px" }}
                className={`rounded-t-md transition-all duration-300 ${
                  isSortedBar
                    ? "bg-green-500"
                    : isComparing
                    ? "bg-yellow-400"
                    : "bg-purple-600"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        <button
          onClick={resetArray}
          disabled={isSorting}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          🔀 New Array
        </button>
        <button
          onClick={bubbleSort}
          disabled={isSorting}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          ▶ Start Sort
        </button>
        <button
          onClick={() => { stopRef.current = true; setIsSorting(false); }}
          disabled={!isSorting}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          ⏹ Stop
        </button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-3 mb-6 text-sm text-gray-400">
        <span>Fast</span>
        <input
          type="range"
          min={100}
          max={1000}
          step={100}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="accent-purple-500"
        />
        <span>Slow</span>
      </div>

      {/* Code Explanation Panel */}
      <CodeExplanationPanel
        currentStep={currentStep}
        iValues={{ i: currentI, j: currentJ, array }}
      />
    </div>
  );
}