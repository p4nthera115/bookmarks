"use client";

import { CardType } from "@/app/definitions";
import { Dispatch, SetStateAction, useState, useEffect, useMemo, useCallback } from "react";
import { BiPound, BiDollar, BiEuro } from "react-icons/bi";
import NumberFlow from "@number-flow/react";
import { TfiClose } from "react-icons/tfi";
import { Instrument_Sans } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const instrument = Instrument_Sans({
  weight: "400",
  variable: "--font-instrument",
  subsets: ["latin"],
});

interface ActiveUiProps {
  cardArr: CardType[];
  setCardArr: Dispatch<SetStateAction<CardType[]>>;
  active: number | null;
  setActive: Dispatch<SetStateAction<number | null>>;
  flipCard: (cardId: number, isFlipped: boolean) => void;
}

export default function ActiveUi({
  cardArr,
  setCardArr,
  active,
  setActive,
  flipCard,
}: ActiveUiProps) {
  const [hasSeenIndicator, setHasSeenIndicator] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState({ id: 1, name: "usd", value: 8.43, symbol: "$" });
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const currencies = [
    { id: 1, name: "usd", icon: <BiDollar />, value: 8.43, symbol: "$" },
    { id: 2, name: "gbp", icon: <BiPound />, value: 6.53, symbol: "£" },
    { id: 3, name: "eur", icon: <BiEuro />, value: 7.79, symbol: "€" },
  ];

  const activeCard = useMemo(() => {
    return cardArr.find((card) => card.id === active) || null;
  }, [cardArr, active]);

  const selectedVariantIndex = activeCard?.selectedVariantIndex ?? 0;
  const selectedVariant = useMemo(() => {
    return activeCard?.colorVariations[selectedVariantIndex];
  }, [activeCard, selectedVariantIndex]);

  const handleClose = useCallback(() => {
    if (activeCard) {
      setActive(null);
      flipCard(activeCard.id, false);
    }
  }, [activeCard, flipCard, setActive]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (active === null) return;

      if (!hasSeenIndicator) setHasSeenIndicator(true);

      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        const nextActive = active === cardArr.length ? cardArr.length : active + 1;
        setActive(nextActive);
        if (activeCard) flipCard(active, false);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        const prevActive = active === 1 ? 1 : active - 1;
        setActive(prevActive);
        if (activeCard) flipCard(active, false);
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, activeCard, flipCard, setActive, handleClose, hasSeenIndicator, cardArr.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setHasSeenIndicator(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 50;

    if (deltaX > swipeThreshold) {
      const currentIndex = cardArr.findIndex(card => card.id === active);
      if (currentIndex > 0) {
        const prevCard = cardArr[currentIndex - 1];
        setActive(prevCard.id);
        if (activeCard) flipCard(activeCard.id, false);
      }
    } else if (deltaX < -swipeThreshold) {
      const currentIndex = cardArr.findIndex(card => card.id === active);
      if (currentIndex < cardArr.length - 1) {
        const nextCard = cardArr[currentIndex + 1];
        setActive(nextCard.id);
        if (activeCard) flipCard(activeCard.id, false);
      }
    }

    setTouchStartX(null);
  };

  const handleCurrencyClick = (id: number) => {
    const nextActive = id % currencies.length
    console.log(nextActive)
    setActiveCurrency(currencies[nextActive])
  }

  const handleVariantClick = (index: number) => {
    if (active !== null) {
      setCardArr((prev) =>
        prev.map((card) =>
          card.id === active ? { ...card, selectedVariantIndex: index } : card
        )
      );
    }
  };

  const nameLength = selectedVariant && activeCard && selectedVariant?.colorName.length + activeCard?.name.length + 1

  const swipeVariants = {
    initial: { x: 0, opacity: 1 },
    animate: {
      x: [0, -80],
      opacity: [0, 1, 0],
      transition: {
        x: {
          times: [0.3, 1],
          delay: 0.7,
          duration: 1,
          repeat: Infinity,
          repeatType: 'loop',
          repeatDelay: 1.2,
          ease: 'circOut'
        },
        opacity: {
          times: [0, 0.3, 1],
          delay: 0.7,
          duration: 0.7,
          repeat: Infinity,
          repeatType: 'loop',
          repeatDelay: 1.5,
          ease: 'easeInOut'
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {active !== null && (
        <div
          className="fixed h-full w-full z-30 flex justify-between"
          style={{ pointerEvents: active ? "auto" : "none" }}
          onClick={() => setHasSeenIndicator(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* INDICATOR */}
          {!hasSeenIndicator && innerWidth < 500 && (
            <motion.div
              initial={{ opacity: 0, }}
              animate={{ opacity: 1, }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              className="absolute h-full w-full bg-black/70 flex gap-2 items-center justify-center z-50 backdrop-blur"
            >
              <div className="flex flex-col items-center text-white justidy-center gap-24 -translate-y-0">
                <div>
                  <div className="border-2 bg-black/30 border-white/50 h-48 p-6 rounded-xl justify-center items-center flex animate-rotate-card ">
                    <span className="tracking-wider text-sm">tilt phone</span>
                  </div>
                </div>
                <div className="justify-center flex flex-col items-center gap-2">
                  <div className="border-white/50 border-2 bg-black/20 rounded-full w-28 h-12 p-2 justify-center items-center flex">
                    <motion.div
                      variants={swipeVariants}
                      initial="initial"
                      animate="animate"
                      className="h-full aspect-square rounded-full bg-white ml-auto">
                    </motion.div>
                  </div>
                  <span className="text-sm">next card</span>
                </div>
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0, duration: 0.3 }}
            className={`${instrument.className} h-full w-full flex justify-between flex-col`}
          >

            {/* TOP */}
            <motion.div className="flex flex-row justify-between w-full h-24 p-5">
              <motion.h2
                key={activeCard?.name}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className={`${nameLength && nameLength >= 20 ? "text-xl" : nameLength && nameLength >= 14 ? "text-2xl" : "text-3xl"} z-10 flex flex-row `}
              >
                <motion.span
                  layout
                  key={selectedVariant?.colorName}
                  initial={{ opacity: 0, }}
                  animate={{ opacity: 1, }}
                  exit={{ opacity: 0, }}
                  transition={{ duration: 0.5, ease: "circInOut" }}
                  className="pr-2"
                >
                  {selectedVariant?.colorName}
                </motion.span>
                <motion.span
                  layout="position"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {activeCard?.name}
                </motion.span>
              </motion.h2>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                onClick={handleClose} className="size-8 lg:size-12 flex justify-center items-center">
                <TfiClose className="size-8" />
              </motion.button>

            </motion.div>

            {/* MIDDLE */}
            {activeCard && (
              <motion.button
                disabled={!active}
                onClick={() =>
                  flipCard(activeCard.id, !activeCard.isFlipped)
                }
                className="h-[32.5rem] w-[18.5rem] rounded-2xl self-center outline-none"
              />
            )}
            <div className="flex justify-center gap-3 mt-auto mb-1 rounded-full ">
              {activeCard?.colorVariations.map((variant, index) => {

                return variant.colorName === "GOLDEN" || variant.colorName === "SILVER"
                  ? (
                    <motion.button
                      key={variant.colorName}
                      onClick={() => handleVariantClick(index)}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className={`rounded-full overflow-hidden ${variant.colorName === "GOLDEN" ? "bg-yellow-500" : "bg-slate-300"} border-black/10 border-2 size-4 lg:size-10 ${selectedVariantIndex === index ? "ring-1 ring-black" : ""}`}
                    >
                      <div className="bg-white rounded-full size-2 blur-sm"></div>
                    </motion.button>
                  )
                  : (
                    <motion.button
                      key={variant.colorName}
                      onClick={() => handleVariantClick(index)}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      style={{ backgroundColor: variant.cardColor }}
                      className={`rounded-full border-black/10 border-2 size-6 lg:size-10 ${selectedVariantIndex === index ? "ring-1 ring-black" : ""}`}
                    />
                  )
              })}
            </div>

            {/* BOTTOM */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex justify-between w-full h-16 items-center p-5 px-3"
            >
              <button
                onClick={() => handleCurrencyClick(activeCurrency.id)}
                className="font-medium flex text-3xl p-1 gap-1 items-center">
                <div
                  className="border-[0.5px] border-black flex text-base rounded-full size-6 items-center justify-center overflow-hidden ">
                  <motion.span
                    key={activeCurrency.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeCurrency.symbol}
                  </motion.span>
                </div>
                <NumberFlow value={activeCurrency.value} />
              </button>

              <div className="h-full flex flex-row items-center justify-end gap-2">
                {activeCard?.inStock ? (
                  <motion.a
                    href={activeCard.link}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    onClick={() => setActive(null)}
                    className="group h-10 w-16 rounded-full border-neutral-800 border overflow-hidden"
                  >
                    <div className="flex flex-col group-hover:-translate-y-10 transition duration-300">
                      <div className="h-10 flex justify-center items-center">Buy</div>
                      <div className="bg-black text-white h-10 flex justify-center items-center">Buy</div>
                    </div>
                  </motion.a>
                ) : (
                  <motion.button
                    disabled
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="h-10 rounded-full border-black/20 text-black/40 border hover:cursor-not-allowed px-3 justify-center items-center"
                  >
                    Out of stock
                  </motion.button>
                )}
              </div>

            </motion.div>
          </motion.div>
        </div>
      )
      }
    </AnimatePresence >
  );
}