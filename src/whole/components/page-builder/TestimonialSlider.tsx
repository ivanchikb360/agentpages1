import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Testimonial {
  author: string
  text: string
}

interface TestimonialSliderProps {
  testimonials: Testimonial[]
}

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [testimonials.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  return (
    <Card className="w-full max-w-md mx-auto relative">
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-lg mb-4">"{testimonials[currentIndex].text}"</p>
          <p className="font-semibold">- {testimonials[currentIndex].author}</p>
        </div>
      </CardContent>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </Card>
  )
}

