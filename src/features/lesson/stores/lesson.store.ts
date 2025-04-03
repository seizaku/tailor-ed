import type { Lesson } from '@prisma/client';
import { create } from 'zustand'
import type { QuizQuestion, Slide } from '~/server/api/routers/teacher/sub-routers/sub-routers/lesson.router.types';
import JSConfetti from 'js-confetti'

interface QuizScore {
  lessonId: string;
  correct: number;
  total: number;
  percentage: number;
}


interface LessonStore {
  activeTab: string;
  currentLesson: Lesson & {
    slides: Slide[]
    quiz: QuizQuestion[]
  } | null;
  currentSlide: number;
  isAudioEnabled: boolean;
  showQuiz: boolean;
  quizAnswers: (string | null)[];
  quizCompleted: boolean;
  quizScore: QuizScore | null;

  startLesson: (lesson: Lesson & {
    slides: Slide[]
    quiz: QuizQuestion[]
  }) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  exitLesson: () => void;
  handleQuizSubmit: () => void;
  handleAnswerSelect: (questionIndex: number, answerIndex: string) => void;
}

const useLessonStore = create<LessonStore>((set) => ({
  activeTab: "lessons",
  currentLesson: null,
  currentSlide: 0,
  isAudioEnabled: false,
  showQuiz: false,
  quizAnswers: [],
  quizCompleted: false,
  quizScore: null,

  startLesson: (lesson) => set(() => ({
    currentLesson: lesson,
    currentSlide: 0,
    activeTab: "active_lessons",
    showQuiz: false,
    quizAnswers: [],
    quizCompleted: false,
    quizScore: null,
  })),

  nextSlide: () => set((state) => {
    if (state.currentLesson && state.currentSlide < state.currentLesson.slides.length - 1) {
      return { currentSlide: state.currentSlide + 1 }
    } else if (state.currentLesson && state.currentSlide === state.currentLesson.slides.length - 1) {
      return { showQuiz: true }
    }
    return {}
  }),

  prevSlide: () => set((state) => {
    if (state.showQuiz) {
      return { showQuiz: false }
    } else if (state.currentLesson && state.currentSlide > 0) {
      return { currentSlide: state.currentSlide - 1 }
    }
    return {}
  }),

  exitLesson: () => set(() => ({
    currentLesson: null,
    activeTab: "lessons",
    showQuiz: false,
    quizAnswers: [],
    quizCompleted: false,
    quizScore: null,
  })),

  handleQuizSubmit: () => set((state) => {
    if (!state.currentLesson?.quiz) return {}

    let correctAnswers = 0
    state.quizAnswers.forEach((answer, index) => {
      if (answer === state.currentLesson?.quiz[index]?.answer.toString()) {
        correctAnswers++
      }
    })

    const score: QuizScore = {
      lessonId: state.currentLesson.lessonId,
      correct: correctAnswers,
      total: state.currentLesson?.quiz.length,
      percentage: Math.round((correctAnswers / state.currentLesson?.quiz.length) * 100),
    }

    window.scrollTo(0, 0)
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti().catch((err) => console.log(err))


    return {
      quizScore: score,
      quizCompleted: true,
    }
  }),

  handleAnswerSelect: (questionIndex, answerIndex) => set((state) => {
    const newAnswers = [...state.quizAnswers]
    newAnswers[questionIndex] = answerIndex
    return { quizAnswers: newAnswers }
  }),
}))

export default useLessonStore;