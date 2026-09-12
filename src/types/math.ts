export interface SolutionStep {
  stepNumber: number;
  explanation: string;
  mathExpression?: string;
  highlightNote?: string;
}

export interface ExerciseProblem {
  id: string;
  exerciseNumber: string; // e.g. 'অনুশীলনী ১ এর ১ (৩)'
  question: string;
  category?: string; // 'ডাকের অংক', 'সরলীকরণ', 'হিসাব করো', 'জ্যামিতি'
  formulaUsed?: string;
  hint: string;
  steps: SolutionStep[];
  finalAnswer: string;
  alternativeMethod?: string;
}

export interface ExampleProblem {
  id: string;
  title: string;
  question: string;
  steps: SolutionStep[];
  finalAnswer: string;
  tip?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Chapter {
  id: number;
  numberBn: string; // '১', '২' ...
  title: string;
  category: 'arithmetic' | 'geometry' | 'measurement' | 'data_tech';
  categoryBn: string;
  color: string;
  iconName: string;
  summary: string;
  learningObjectives: string[];
  keyFormulas: { name: string; formula: string; note?: string }[];
  keyTheories: { title: string; content: string; visualType?: string }[];
  examples: ExampleProblem[];
  exercises: ExerciseProblem[];
  interactiveToolType?: 'fraction' | 'geometry' | 'lcmgcd' | 'unittime' | 'barchart' | 'calculator' | 'none';
  quiz: QuizQuestion[];
}

export type ActiveTab = 'theory' | 'solutions' | 'interactive' | 'quiz' | 'worksheet' | 'ai_generator';
