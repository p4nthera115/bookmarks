"use client";

import { CardType } from "@/app/definitions";
import { Dispatch, SetStateAction, useState, useEffect, useMemo, useCallback } from "react";
import { BiPound, BiDollar, BiEuro } from "react-icons/bi";
import { SiMaterialdesignicons } from "react-icons/si";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { RxDimensions } from "react-icons/rx";
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
  const [activeCurrency, setActiveCurrency] = useState({ name: "usd", value: 8.43, symbol: "$" });

  const currencies = [
    { name: "usd", icon: <BiDollar />, value: 8.43, symbol: "$" },
    { name: "gbp", icon: <BiPound />, value: 6.53, symbol: "£" },
    { name: "eur", icon: <BiEuro />, value: 7.79, symbol: "€" },
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
        const nextActive = active % 11 + 1;
        setActive(nextActive);
        if (activeCard) flipCard(active, false);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        const prevActive = active === 1 ? 11 : active - 1;
        setActive(prevActive);
        if (activeCard) flipCard(active, false);
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, activeCard, flipCard, setActive, handleClose, hasSeenIndicator]);



  const handlePage = (activeId: number) => {
    if (active && activeCard) {
      setActive(activeId);
      flipCard(active, false);
    }
  };

  const handleVariantClick = (index: number) => {
    if (active !== null) {
      setCardArr((prev) =>
        prev.map((card) =>
          card.id === active ? { ...card, selectedVariantIndex: index } : card
        )
      );
    }
  };

  return (
    <AnimatePresence>
      {active !== null && (
        <div
          className="fixed h-full w-full z-30 p-10 lg:p-14 flex"
          style={{ pointerEvents: active ? "auto" : "none" }}
          onClick={() => setHasSeenIndicator(true)}
        >
          {/* INDICATOR */}
          {!hasSeenIndicator && (
            <motion.div
              initial={{ opacity: 0, x: "-50%", y: 20 }}
              animate={{ opacity: 0.5, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-6 left-1/2 border bg-black/90 border-black/20 text-black/40 p-2 rounded-lg shadow-lg flex gap-2 items-center"
            >
              <div className="flex gap-1">
                <div className="text-2xl justify-center flex items-center border border-white/50 text-white p-1 size-8 rounded-lg">
                  <IoIosArrowRoundBack />
                </div>
                <div className="text-2xl justify-center flex items-center border border-white/50 text-white p-1 size-8 rounded-lg">
                  <IoIosArrowRoundForward />
                </div>
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0, duration: 0.3 }}
            className={`${instrument.className} h-full w-full flex justify-between`}
          >
            {/* LEFT */}
            <motion.div className="flex flex-col justify-between h-full w-1/4">
              <motion.h2
                key={activeCard?.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-4xl lg:text-4xl "
              >
                {activeCard?.name}
              </motion.h2>
              <motion.div
                key={activeCard?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: active ? 0.5 : 0, duration: 0.3 }}
                className="max-h-[66.6666%] overflow-scroll text-xs lg:text-sm leading-tight flex pr-3"
              >
                {activeCard?.info}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: active ? 0.6 : 0, duration: 0.3 }}
                className="flex gap-2 w-full h-12 items-center"
              >
                {[...Array(cardArr.length)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePage(i + 1)}
                    className={`border rounded-full size-2 border-black/30 ${activeCard?.id === i + 1 ? "bg-neutral-800" : "bg-none"}`}
                  />
                ))}
              </motion.div>
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

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex flex-col justify-between h-full w-1/4"
            >
              <motion.button onClick={handleClose} className="size-8 lg:size-12 flex justify-center ml-auto">
                <TfiClose className="size-10" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex flex-col w-full h-2/3 lg:p-4 relative"
              >
                <ul className="flex flex-col gap-6 w-full justify-between items-center h-full">
                  <li className="flex justify-between w-full px-2 lg:px-6">
                    <RxDimensions className="size-[1.5rem] lg:size-[2rem]" />
                    <div className="text-xs lg:text-base text-end">
                      <p>2.0in x 3.5in</p>
                      <p>5.08cm x 8.89cm</p>
                    </div>
                  </li>

                  <li className="flex w-full justify-center gap-6">
                    {activeCard?.colorVariations.map((variant, index) => (
                      <motion.button
                        key={variant.colorName}
                        onClick={() => handleVariantClick(index)}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        style={{ backgroundColor: variant.cardColor }}
                        className={`rounded-full border-black/10 border-2 size-6 lg:size-10 ${selectedVariantIndex === index ? "ring-2 ring-black" : ""
                          }`}
                      />
                    ))}
                  </li>

                  <li className="flex justify-between w-full px-2 lg:px-6 text-xs lg:text-base text-end">
                    <SiMaterialdesignicons className="size-[1rem] lg:size-[1.4rem]" />
                    <p>
                      Matte paper,{" "}
                      <motion.span
                        key={selectedVariant?.foilColor}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        {selectedVariant && selectedVariant?.foilColor.charAt(0).toUpperCase() +
                          selectedVariant?.foilColor.slice(1)}
                        foil
                      </motion.span>
                    </p>
                  </li>

                  <li className="text-3xl lg:text-5xl font-medium flex justify-between w-full items-end p-1">
                    <NumberFlow value={activeCurrency.value} prefix={activeCurrency.symbol} />
                    <div className="flex flex-row text-xs lg:text-xl my-1">
                      {currencies.map((currency) => (
                        <button
                          key={currency.name}
                          onClick={() => setActiveCurrency(currency)}
                          className={`${activeCurrency.name === currency.name ? "opacity-100" : "opacity-40"}`}
                        >
                          {currency.icon}
                        </button>
                      ))}
                    </div>
                  </li>
                </ul>
              </motion.div>
              {activeCard?.inStock ? (
                <motion.a
                  href={activeCard.link}
                  target="_blank"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="group h-12 w-full rounded-full border-neutral-800 border overflow-hidden"
                >
                  <div className="flex flex-col group-hover:-translate-y-12 transition duration-300">
                    <div className="h-12 flex justify-center items-center">Buy now</div>
                    <div className="bg-black text-white h-12 flex justify-center items-center">Buy now</div>
                  </div>
                </motion.a>
              ) : (
                <motion.button
                  disabled
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="h-12 w-full rounded-full border-black/20 text-black/40 border hover:cursor-not-allowed"
                >
                  Out of stock
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}