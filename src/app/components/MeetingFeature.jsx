"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const slides = [
  {
    image:
      "https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg",
    title: "Get a link you can share",
    description:
      "Click New meeting to get a link you can send to people you want to meet with",
  },
  {
    image:
      "https://www.gstatic.com/meet/user_edu_scheduling_light_b352efa017e4f8f1ffda43e847820322.svg",
    title: "Plan ahead",
    description:
      "Click New meeting to schedule meetings in Google Calendar and send invites to participants",
  },
  {
    image:
      "https://www.gstatic.com/meet/user_edu_safety_light_e04a2bbb449524ef7e49ea36d5f25b65.svg",
    title: "Your meeting is safe",
    description:
      "No one can join a meeting unless invited or admitted by the host",
  },
];

const MeetingFeature = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    //example = currentSlide =0 and slide length =3
    //nextIndex = (1+1) % 3
    // 2 % 3 =2
    const nextIndex = (currentSlide + 1) % slides.length;
    setCurrentSlide(nextIndex);
  };

  const prevSlide = () => {
    // current is 0  lenght =3
    //prevIndex = (0 -1 +3 )%3=2
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    setCurrentSlide(prevIndex);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Image
          src={slides[currentSlide].image}
          alt="meeting_feature"
          width={300}
          height={300}
          className="h-40 w-40 rounded-[2rem] opacity-90 grayscale md:h-64 md:w-64"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -left-10 transform -translate-y-1/2 -translate-x-full"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -right-10 transform -translate-y-1/2 translate-x-full"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <h2 className="mb-2 mt-6 text-2xl font-semibold text-nust-blue dark:text-blue-300">
        {slides[currentSlide].title}
      </h2>
      <p className="max-w-sm text-center text-slate-600 dark:text-slate-300">
        {slides[currentSlide].description}
      </p>
      <div className="flex justify-center space-x-2 mt-4">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              index == currentSlide ? "bg-nust-blue dark:bg-blue-500" : "bg-slate-300 dark:bg-white/20"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MeetingFeature;

