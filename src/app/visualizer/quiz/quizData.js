export const quizCatalog = [
  {
    title: "Linear Search Quiz",
    description:
      "Test your understanding of Linear Search with multiple-choice questions.",
    href: "/visualizer/array/linearsearch/quiz",
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    title: "Binary Search Quiz",
    description:
      "Test your understanding of Binary Search with multiple-choice questions.",
    href: "/visualizer/array/binarysearch/quiz",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    title: "Bubble Sort Quiz",
    description:
      "Test your understanding of Bubble Sort with multiple-choice questions.",
    href: "/visualizer/array/bubblesort/quiz",
    color: "bg-green-600 hover:bg-green-700",
    group: "Sorting",
  },
  {
    title: "Selection Sort Quiz",
    description:
      "Test your understanding of Selection Sort with multiple-choice questions.",
    href: "/visualizer/array/selectionsort/quiz",
    color: "bg-orange-500 hover:bg-orange-600",
    group: "Sorting",
  },
  {
    title: "Insertion Sort Quiz",
    description:
      "Test your understanding of Insertion Sort with multiple-choice questions.",
    href: "/visualizer/array/insertionsort/quiz",
    color: "bg-pink-600 hover:bg-pink-700",
    group: "Sorting",
  },
  {
    title: "Merge Sort Quiz",
    description:
      "Test your understanding of Merge Sort with multiple-choice questions.",
    href: "/visualizer/array/mergesort/quiz",
    color: "bg-indigo-600 hover:bg-indigo-700",
    group: "Sorting",
  },
  {
    title: "Quick Sort Quiz",
    description:
      "Test your understanding of Quick Sort with multiple-choice questions.",
    href: "/visualizer/array/quicksort/quiz",
    color: "bg-red-600 hover:bg-red-700",
    group: "Sorting",
  },
  {
    title: "Heap Sort Quiz",
    description:
      "Test your understanding of Heap Sort with multiple-choice questions.",
    href: "/visualizer/array/heapsort/quiz",
    color: "bg-yellow-600 hover:bg-yellow-700",
    group: "Sorting",
  },
  {
    title: "Radix Sort Quiz",
    description:
      "Test your understanding of Radix Sort with multiple-choice questions.",
    href: "/visualizer/array/radixsort/quiz",
    color: "bg-cyan-600 hover:bg-cyan-700",
    group: "Sorting",
  },
  {
    title: "Counting Sort Quiz",
    description:
      "Test your understanding of Counting Sort with multiple-choice questions.",
    href: "/visualizer/array/countingsort/quiz",
    color: "bg-emerald-600 hover:bg-emerald-700",
    group: "Sorting",
  },
  {
    title: "Basic Recursion Quiz",
    description:
      "Test your understanding of Basic Recursion with multiple-choice questions.",
    href: "/visualizer/recursion/basic-recursion/quiz",
    color: "bg-teal-600 hover:bg-teal-700",
  },
  {
    title: "Functional & Parameterized Recursion Quiz",
    description:
      "Test your understanding of Functional & Parameterized Recursion with multiple-choice questions.",
    href: "/visualizer/recursion/functional-parameterized/quiz",
    color: "bg-violet-600 hover:bg-violet-700",
  },
  {
    title: "Multiple Recursive Calls Quiz",
    description:
      "Test your understanding of Multiple Recursive Calls with multiple-choice questions.",
    href: "/visualizer/recursion/multiple-calls/quiz",
    color: "bg-sky-600 hover:bg-sky-700",
  },
  {
    title: "Recursion on Subsequences Quiz",
    description:
      "Test your understanding of Recursion on Subsequences with multiple-choice questions.",
    href: "/visualizer/recursion/subsequences/quiz",
    color: "bg-rose-600 hover:bg-rose-700",
  },
  {
    title: "Backtracking Quiz",
    description:
      "Test your understanding of Backtracking with multiple-choice questions.",
    href: "/visualizer/recursion/backtracking/quiz",
    color: "bg-amber-600 hover:bg-amber-700",
  },
  {
    title: "Recursion Trees Quiz",
    description:
      "Test your understanding of Recursion Trees with multiple-choice questions.",
    href: "/visualizer/recursion/trees/quiz",
    color: "bg-violet-600 hover:bg-violet-700",
  },
  {
    title: "Call Stack Visualization Quiz",
    description:
      "Test your understanding of Call Stack Visualization with multiple-choice questions.",
    href: "/visualizer/recursion/stack/quiz",
    color: "bg-slate-600 hover:bg-slate-700",
  },
  {
    title: "Recursive Binary Search Quiz",
    description:
      "Test your understanding of Recursive Binary Search with multiple-choice questions.",
    href: "/visualizer/recursion/binary-search/quiz",
    color: "bg-blue-700 hover:bg-blue-800",
  },
  {
    title: "Tower of Hanoi Recursion Quiz",
    description:
      "Test your understanding of the Tower of Hanoi recursion algorithm with multiple-choice questions.",
    href: "/visualizer/recursion/tower-of-hanoi/quiz",
    color: "bg-violet-600 hover:bg-violet-700",
  },
];

const SORTING_GROUP_TITLE = "Sorting Quiz";

export function buildQuizCards(searchQuery = "") {
  const query = searchQuery.trim().toLowerCase();
  const matches = (quiz) =>
    !query ||
    quiz.title.toLowerCase().includes(query) ||
    quiz.description.toLowerCase().includes(query) ||
    (quiz.group || "").toLowerCase().includes(query);

  const cards = [];
  const sortingGroup = [];

  quizCatalog.forEach((quiz) => {
    if (!matches(quiz)) return;

    if (quiz.group === "Sorting") {
      sortingGroup.push(quiz);
      return;
    }

    cards.push({
      type: "single",
      ...quiz,
    });
  });

  if (sortingGroup.length > 0) {
    cards.push({
      type: "group",
      title: SORTING_GROUP_TITLE,
      description:
        "Browse all sorting algorithm quizzes from one organized card.",
      color: "bg-indigo-600 hover:bg-indigo-700",
      items: sortingGroup,
    });
  }

  return cards;
}
