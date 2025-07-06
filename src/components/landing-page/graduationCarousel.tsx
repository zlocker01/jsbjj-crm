"use client";

import Image from "next/image";
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
                    key={currentImage}
                    className="w-full h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src={graduationImages[currentImage].src}
                        alt={graduationImages[currentImage].alt}
                        fill
                        className="object-contain"
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
