"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Button } from "~/components/ui/button";
import useLessonStore from "../stores/lesson.store"
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { useEffect } from "react";
import { api } from "~/trpc/react";



const Lesson: React.FC = () => {

  const lessonStore = useLessonStore();

  const { mutateAsync: finishLesson } = api.teacher.class.lesson.finishLesson.useMutation()

  useEffect(() => {
    console.log(lessonStore.currentLesson?.quiz)
  }, [lessonStore.currentLesson?.quiz])

  async function handleFinishLesson() {
    const quizScore = lessonStore.quizScore;
    await finishLesson({
      correct: quizScore!.correct,
      lessonId: quizScore!.lessonId,
      percentage: quizScore!.percentage,
      total: quizScore!.total
    });

    lessonStore.exitLesson()
  }

  return <>
    {lessonStore.currentLesson && (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={lessonStore.exitLesson}>
            Exit Lesson
          </Button>
          <div className="flex items-center space-x-2">
            <Label htmlFor="audio-narration" className="text-sm">
              Audio Narration
            </Label>
            <Switch id="audio-narration"
              checked={lessonStore.isAudioEnabled}
            // onCheckedChange={setIsAudioEnabled}
            />
          </div>
        </div>

        {!lessonStore.showQuiz ? (
          // Slide Content
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="bg-sky-50 text-sky-700 hover:bg-sky-50">
                  {lessonStore.currentLesson.topic}
                </Badge>
                <div className="text-sm text-slate-500">
                  Slide {lessonStore.currentSlide + 1} of {lessonStore.currentLesson.slides.length}
                </div>
              </div>
              <CardTitle className="text-xl mt-2">{lessonStore.currentLesson.slides[lessonStore.currentSlide]?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] whitespace-pre-line">
                {lessonStore.currentLesson.slides[lessonStore.currentSlide]?.content}
              </div>

              {lessonStore.isAudioEnabled && (
                <div className="flex items-center mt-4 p-3 bg-slate-50 rounded-md">
                  <Volume2 className="h-5 w-5 text-sky-600 mr-2" />
                  <div className="text-sm text-slate-600">{lessonStore.currentLesson.slides[lessonStore.currentSlide]?.narration}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          // Quiz Content
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="bg-sky-50 text-sky-700 hover:bg-sky-50">
                  Quiz
                </Badge>
              </div>
              <CardTitle className="text-xl mt-2">Test Your Knowledge</CardTitle>
              <CardDescription>Answer the following questions to complete the lesson</CardDescription>
            </CardHeader>
            <CardContent>
              {lessonStore.quizCompleted ? (
                <div className="space-y-4">
                  <div className="text-center p-4">
                    <h3 className="text-xl font-bold mb-2">Quiz Completed!</h3>
                    <p className="text-lg">
                      You scored {lessonStore.quizScore?.correct} out of {lessonStore.quizScore?.total} ({lessonStore.quizScore?.percentage}%)
                    </p>
                  </div>
                  <div className="space-y-4">
                    {lessonStore.currentLesson.quiz?.map((question, qIndex) => (
                      <div key={qIndex} className="border rounded-md p-4">
                        <p className="font-medium mb-2">{question.question}</p>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className={`p-2 rounded-md ${oIndex === question.answer
                                ? "bg-green-50 border border-green-200"
                                : lessonStore.quizAnswers[qIndex] === oIndex.toString() && lessonStore.quizAnswers[qIndex] !== question.answer.toString()
                                  ? "bg-red-50 border border-red-200"
                                  : "bg-slate-50"
                                }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {lessonStore.currentLesson.quiz?.map((question: any, qIndex: number) => (
                    <div key={qIndex} className="space-y-2">
                      <h3 className="font-medium">
                        {qIndex + 1}. {question.question}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option: any, oIndex: number) => (
                          <div
                            key={oIndex}
                            className={`p-3 rounded-md border cursor-pointer ${lessonStore.quizAnswers[qIndex] === oIndex.toString() ? "border-sky-500 bg-sky-50" : "hover:bg-slate-50"
                              }`}
                            onClick={() => lessonStore.handleAnswerSelect(qIndex, oIndex.toString())}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={lessonStore.prevSlide} disabled={lessonStore.currentSlide === 0 && !lessonStore.showQuiz}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>

          {!lessonStore.showQuiz ? (
            <Button onClick={lessonStore.nextSlide} disabled={lessonStore.currentSlide === lessonStore.currentLesson.slides?.length - 1 && lessonStore.showQuiz}>
              {lessonStore.currentSlide === lessonStore.currentLesson.slides?.length - 1 ? "Start Quiz" : "Next"}{" "}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : !lessonStore.quizCompleted ? (
            <Button onClick={lessonStore.handleQuizSubmit} disabled={lessonStore.quizAnswers.length < lessonStore.currentLesson.quiz?.length}>
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleFinishLesson}>Finish Lesson</Button>
          )}
        </div>

        <Progress
          value={
            lessonStore.showQuiz ? (lessonStore.quizCompleted ? 100 : 90) : ((lessonStore.currentSlide + 1) / lessonStore.currentLesson.slides?.length) * 80
          }
          className="h-1 mt-4"
        />
      </div>
    )}
  </>
}

export { Lesson }