"use client"

import { useState, useEffect } from "react"
import { CardType } from "./definitions"
import DesktopScene from "@/components/desktop/DesktopScene"
import MobileScene from "@/components/mobile/MobileScene"

export default function Home() {
  const [active, setActive] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 599);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const [cardArr, setCardArr] = useState<CardType[]>(
    [
      {
        id: 1,
        name: "Fern",
        colorVariations: [
          {
            colorName: "Blue",
            cardColor: "#adc8e0",
            bgColor: "#728ca3",
            illustration: {
              front: "/fern/illustrations/blue.png",
              back: "/fern/illustrations/blue.png",
            },
            foilColor: "silver"
          },
          {
            colorName: "Green",
            cardColor: "#50523c",
            bgColor: "#718259",
            illustration: {
              front: "/fern/illustrations/green.png",
              back: "/fern/illustrations/green.png",
            },
            foilColor: "gold"
          },
          {
            colorName: "Black",
            cardColor: "#2b2826",
            bgColor: "#675f5a",
            illustration: {
              front: "/fern/illustrations/black.png",
              back: "/fern/illustrations/black.png",
            },
            foilColor: "gold"
          },
        ],
        foil: {
          front: "/fern/foil/foil.png",
          back: "/fern/foil/foil.png",
        },
        normalMap: {
          front: "/fern/normal.png",
          back: "/fern/normal.png",
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any reader!<br /><br />

            My fern design is inspired by my love of nature and old books with ornate gold or silver foiling! I&#39;ve always had an eye for detail, so it was a joy to create this intricate design.<br /><br />

            This mini bookmark is printed on thick high quality paper, has gold-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "",
        inStock: false,
        isFlipped: false,
        selectedVariantIndex: 0

      },
      {
        id: 2,
        name: "Oak",
        colorVariations: [
          {
            colorName: "Dark Blue",
            cardColor: "#293348",
            bgColor: "#546790",
            illustration: {
              front: "/oak/illustrations/blue.png",
              back: "/oak/illustrations/blue.png",
            },
            foilColor: "gold"
          },
          {
            colorName: "Green",
            cardColor: "#adc8e0",
            bgColor: "#91b2cf",
            illustration: {
              front: "",
              back: "",
            },
            foilColor: "gold"
          },
          {
            colorName: "Orange",
            cardColor: "#adc8e0",
            bgColor: "#91b2cf",
            illustration: {
              front: "",
              back: "",
            },
            foilColor: "gold"
          },
        ],
        foil: {
          front: "/oak/foil.png",
          back: "/oak/foil.png"
        },
        normalMap: {
          front: "/oak/normal.png",
          back: "/oak/normal.png",
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any reader!<br /><br />

            My oak design is inspired by my love of nature and (specifically) one of my favorite types of trees!<br /><br />

            This mini bookmark is printed on thick high quality paper, has gold-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "",
        inStock: false,
        isFlipped: false,
        selectedVariantIndex: 0

      },
      {
        id: 3,
        name: "I'm well-read",
        colorVariations: [
          {
            colorName: "",
            cardColor: "#fff6e3",
            bgColor: "#cdc0a6",
            illustration: {
              front: "/wellread/illustrations/front.png",
              back: "/wellread/illustrations/back.png",
            },
            foilColor: "gold"
          }
        ],
        foil: {
          front: "/wellread/foil/front.png",
          back: "/wellread/foil/back.png"
        },
        normalMap: {
          front: "/wellread/normals/front.png",
          back: "/wellread/normals/back.png",
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any reader!<br /><br />

            My “I&#39;m well-read” design is inspired by my book club, the Wellread book club. Being “well-read” can mean many different things, but I associate it with reading from a wide variety of genres… which is our goal for the book club. Each month, we read a book from a different genre. <br /><br />

            I thought it would be fun to design a mini bookmark that we could use for the books we read for the book club, or any of our books!<br /><br />

            <span className="italic font-serif">You don&#39;t have to be a member of the book club to purchase this item. I just want to make that clear :)</span><br /><br />

            I also think of a well-read book is a book that has been annotated, dog eared, highlighted, or underlined. If you&#39;re that kind of reader, then this book mark is perfect for you!<br /><br />

            This mini bookmark is printed on thick high quality paper, has gold-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "https://www.etsy.com/listing/1852677200/im-well-read-double-sided-mini-bookmark?ls=r&ref=hp_rv-1&content_source=53cd7b6815125246a52314c771e65a9273270ce1%253A1852677200&logging_key=53cd7b6815125246a52314c771e65a9273270ce1%3A1852677200",
        inStock: true,
        isFlipped: false,
        selectedVariantIndex: 0

      },
      {
        id: 4,
        name: "Van Gogh's Book",
        colorVariations: [
          {
            colorName: "",
            cardColor: "#fff9ef",
            bgColor: "#cfc7b7",
            illustration: {
              front: "/vangogh/illustration.png",
              back: "/vangogh/illustration.png",
            },
            foilColor: "silver"
          }
        ],
        foil: {
          front: "/vangogh/foil.png",
          back: "/vangogh/foil.png"
        },
        normalMap: {
          front: "/vangogh/normal.png",
          back: "/vangogh/normal.png"
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any reader!<br /><br />

            This mini bookmark is printed on thick high quality paper, has silver-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "",
        inStock: false,
        isFlipped: false,
        selectedVariantIndex: 0

      },
      {
        id: 5,
        name: "Penguin's Book",
        colorVariations: [
          {
            colorName: "",
            cardColor: "#adc8e0",
            bgColor: "#91b2cf",
            illustration: {
              front: "",
              back: "",
            },
            foilColor: "gold"
          }
        ],
        foil: {
          front: "",
          back: "/penguin/foil.png"
        },
        normalMap: {
          front: "",
          back: "/penguin/normal.png",
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any reader and any book!<br /><br />

            Do you ever think about how your book might feel when you hold it? No... just me? Regardless, I thought it would be sweet to make this design in honor of whichever book you place it in :)<br /><br />

            This mini bookmark is printed on thick high quality paper, has gold-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "",
        inStock: false,
        isFlipped: false,
        selectedVariantIndex: 0

      },
      {
        id: 6,
        name: "Fox",
        colorVariations: [
          {
            colorName: "GOLDEN",
            cardColor: "#d0d2d1",
            bgColor: "#f2d2bd",
            illustration: {
              front: "/fox/illustration.png",
              back: "/fox/illustration.png",
            },
            foilColor: "gold"
          },
          {
            colorName: "SILVER",
            cardColor: "#d0d2d1",
            bgColor: "#f2d2bd",
            illustration: {
              front: "/fox/illustration.png",
              back: "/fox/illustration.png",
            },
            foilColor: "silver"
          }
        ],
        foil: {
          front: "/fox/foil.png",
          back: "/fox/foil.png"
        },
        normalMap: {
          front: "/fox/normal.png",
          back: "/fox/normal.png",
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any reader!<br /><br />

            My Fox design is inspired by my love for (and addiction to buying) adorable ornaments! This fox, in particular is an homage to the fox in my favorite book &#34;The little prince&#34; by Antoine de Saint-Exupery! It was such a joy to paint this illustration, so I hope you love it as much as I do! (The stars make my heart endlessly happy) ✨<br /><br />

            This mini bookmark is printed on thick high quality paper, has gold-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "",
        inStock: false,
        isFlipped: false,
        selectedVariantIndex: 0

      },
      {
        id: 7,
        name: "Snowman",
        colorVariations: [
          {
            colorName: "GOLDEN",
            cardColor: "#e9e9e7",
            bgColor: "#ffffff",
            illustration: {
              front: "/snowman/illustration.png",
              back: "/snowman/illustration.png",
            },
            foilColor: "gold"
          },
          {
            colorName: "SILVER",
            cardColor: "#e9e9e7",
            bgColor: "#ffffff",
            illustration: {
              front: "/snowman/illustration.png",
              back: "/snowman/illustration.png",
            },
            foilColor: "silver"
          },
        ],
        foil: {
          front: "/snowman/foil.png",
          back: "/snowman/foil.png",
        },
        normalMap: {
          front: "/snowman/normal.png",
          back: "/snowman/normal.png",
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any reader!<br /><br />

            My Snowman design is inspired by my love for (and addiction to buying) adorable ornaments! Naturally, I couldn&#39;t help but paint a book in his little snowy hands. In my mind, everyone is a reader... even snowmen!<br /><br />

            This mini bookmark is printed on thick high quality paper, has gold-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "",
        inStock: false,
        isFlipped: false,
        selectedVariantIndex: 0

      },
      {
        id: 8,
        name: "The Nutcracker",
        colorVariations: [
          {
            colorName: "",
            cardColor: "#dfe3e0",
            bgColor: "#9bb5b6",
            illustration: {
              front: "/nutcracker/illustration.png",
              back: "/nutcracker/illustration.png",
            },
            foilColor: "gold"
          }
        ],
        foil: {
          front: "/nutcracker/foil.png",
          back: "/nutcracker/foil.png"
        },
        normalMap: {
          front: "/nutcracker/normal.png",
          back: "/nutcracker/normal.png"
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any reader!<br /><br />

            My Nutcracker design is inspired by E.T.A. Hoffman&#39;s classic story. I&#39;ve collected Nutcrackers for many years, because they are one of my favorite holiday decorations. I love that each nutcracker feels as if they have their own personality and story. The nutcracker I painted for this bookmark loves to read... if you couldn&#39;t tell by looking at him :)<br /><br />

            This mini bookmark is printed on thick high quality paper, has gold-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "",
        inStock: false,
        isFlipped: false,
        selectedVariantIndex: 0

      },
      {
        id: 9,
        name: "Golden Readers",
        colorVariations: [
          {
            colorName: "",
            cardColor: "#adc8e0",
            bgColor: "#91b2cf",
            illustration: {
              front: "",
              back: "",
            },
            foilColor: "gold"
          }
        ],
        foil: {
          front: "/readers/foil/front.png",
          back: "/readers/foil/back.png"
        },
        normalMap: {
          front: "/readers/normals/front.png",
          back: "/readers/normals/back.png",
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any reader!<br /><br />

            My golden readers design is inspired by Matisse ink sketches. I&#39;ve always had a passion for art history, so to make these Matisse figures into readers was a joy!<br /><br />

            I&#39;m also a huge fan of typography, so the repeat pattern of the work &#34;BOOKS&#34; makes my graphic design loving heart very happy!<br /><br />

            This mini bookmark is printed on thick high quality paper, has gold-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "",
        inStock: false,
        isFlipped: false,
        selectedVariantIndex: 0

      },
      {
        id: 10,
        name: "Hello I'm",
        colorVariations: [
          {
            colorName: "",
            cardColor: "#e3d0d2",
            bgColor: "#f5d9dc",
            illustration: {
              front: "/hello/illustration.png",
              back: "/hello/illustration.png",
            },
            foilColor: "gold"
          }
        ],
        foil: {
          front: "/hello/foil/front.png",
          back: "/hello/foil/back.png"
        },
        normalMap: {
          front: "/hello/normals/front.png",
          back: "/hello/normals/back.png",
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any book nerd!<br /><br />

            I&#39;ve had the idea for this bookmark design for quite a while, and it was so much fun to finally bring it to life!<br /><br />

            Picture this: you&#39;re in the middle of reading a book, when someone interrupts and starts talking to you. Simply hold up your bookmark (the side that has &#34;Hello&#34; crossed out... &#34;I&#39;m reading&#34;) and they will hopefully get the hint to leave you and your book in peace :P<br /><br />

            This mini bookmark is printed on thick high quality paper, has gold-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "",
        inStock: false,
        isFlipped: false,
        selectedVariantIndex: 0

      },
      {
        id: 11,
        name: "Protagonist/Antagonist",
        colorVariations: [
          {
            colorName: "",
            cardColor: "#a3b9ac",
            bgColor: "#91ae9d",
            illustration: {
              front: "/ant-pro/illustrations/front.png",
              back: "/ant-pro/illustrations/back.png",
            },
            foilColor: "gold"
          }
        ],
        foil: {
          front: "/ant-pro/foil/front.png",
          back: "/ant-pro/foil/back.png"
        },
        normalMap: {
          front: "/ant-pro/normals/front.png",
          back: "/ant-pro/normals/back.png",
        },
        info: (
          <p>
            This mini bookmark is the perfect companion for any protagonist OR antagonist!<br /><br />

            With this bookmark, you must choose: protagonist or antagonist... Will you join ther dark side, or will you be the hero of your own story?<br /><br />

            Side note: I truly love this design and how you can flip between &#34;the dark&#34; and &#34;the light&#34; !!!<br /><br />

            This mini bookmark is printed on thick high quality paper, has gold-foil accents, and a nice buttery matte finish. It&#39;s also double-sided, so whichever way you place it in your book you&#39;ll have a lovely design to see.
          </p>
        ),
        link: "",
        inStock: false,
        isFlipped: false,
        selectedVariantIndex: 0

      }
    ]
  )

  const flipCard = (cardId: number, isFlipped: boolean) => {
    setCardArr((prevState: CardType[]) =>
      prevState.map((card) =>
        card.id === cardId ? { ...card, isFlipped } : card
      )
    );
  };

  return (
    <main className="h-dvh w-dvw relative">
      {isMobile ? (
        <MobileScene
          cardArr={cardArr}
          setCardArr={setCardArr}
          active={active}
          setActive={setActive}
          isLoaded={isLoaded}
          setIsLoaded={setIsLoaded}
          flipCard={flipCard}
        />
      ) : (
        <DesktopScene
          cardArr={cardArr}
          setCardArr={setCardArr}
          active={active}
          setActive={setActive}
          isLoaded={isLoaded}
          setIsLoaded={setIsLoaded}
          flipCard={flipCard}
        />
      )}
    </main>
  )
}


