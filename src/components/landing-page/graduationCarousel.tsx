"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const graduationImages = [
    {
        src: "/landing-page/graduation/p1.jpg",
        alt: "peinados para graduacion en Tlaxcala",
    },
    {
        src: "/landing-page/graduation/p2.jpg",
        alt: "maquillaje para graduacion en Tlaxcala",
    },
    {
        src: "/landing-page/graduation/p3.jpg",
        alt: "peinados para graduacion en Tlaxcala",
    },
];

export default function GraduationCarousel() {
    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % graduationImages.length);
    };

    const prevImage = () => {
        setCurrentImage(
            (prev) => (prev - 1 + graduationImages.length) % graduationImages.length,
        );
    };

    useEffect(() => {
        const timer = setTimeout(nextImage, 4000);
        return () => clearTimeout(timer);
    }, [currentImage]);

    return (
        <div className="relative h-[400px] rounded-2xl overflow-hidden group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`image-${currentImage}`}
                    className="w-full h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <img
                        src={graduationImages[currentImage].src}
                        alt={graduationImages[currentImage].alt}
                        className="h-full w-full object-contain"
                    />
                </motion.div>
            </AnimatePresence>
            <button
                type="button"
                onClick={prevImage}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Imagen anterior"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                type="button"
                onClick={nextImage}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Imagen siguiente"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
}
