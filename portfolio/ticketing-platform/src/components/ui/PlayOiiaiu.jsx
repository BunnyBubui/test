import "../../styles/ui/PlayOiiaiu.css";
import { useEffect, useState } from "react";

const PlayOiiaiu = ({ isPlaying }) => {
    const [isMounted, setIsMounted] = useState(true);
    const [isFading, setIsFading] = useState(false); 
    const [effect, setEffect] = useState("");

    useEffect(() => {
        if (!isPlaying) {
            setIsFading(true); 

            const timer = setTimeout(() => {
                setIsMounted(false); 
            }, 1000); 

            return () => clearTimeout(timer);
        } else {
            setIsMounted(true);
            setIsFading(false);
        }
    }, [isPlaying]);

    if (!isMounted) return null;

    useEffect(() => {
        const img = document.querySelector(".o-content img");
        const bg = document.querySelector(".o-bg-spread");
        if (!img) return;

        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

        (async () => {
            img.classList.add("activeSpinSpeed");
            await sleep(2000);

            img.classList.remove("activeSpinSpeed");
            await sleep(1000);

            img.classList.add("activeSpinSlow");
            await sleep(2400);

            img.classList.remove("activeSpinSlow");
            await sleep(800);

            img.classList.add("activeSpinSpeed");
            setEffect(1)
            await sleep(100);

            bg.classList.add("active");
            setEffect(2);
            await sleep(300);

            bg.classList.remove("active");
            setEffect(1);
            await sleep(5800);

            bg.classList.add("active");
            setEffect(2);
            await sleep(150);
            setEffect(0);
            await sleep(150);

            bg.classList.remove("active");
            setEffect(2);
            await sleep(150);
            setEffect(1);
            await sleep(1150);

            bg.classList.add("active");
            setEffect(2);
            await sleep(150);
            setEffect(0);
            await sleep(150);

            bg.classList.remove("active");
            setEffect(2);
            await sleep(150);
            setEffect(1);
            await sleep(1150);

            setEffect(2);
            bg.classList.add("active");
            await sleep(150);
            setEffect(0);
            await sleep(150);

            bg.classList.remove("active");
            await sleep(150);
            setEffect(1);
            await sleep(1150);

            bg.classList.add("active");
            await sleep(150);
            setEffect(0);
            await sleep(150);

            bg.classList.remove("active");
            await sleep(150);
            setEffect(1);
            await sleep(1150);

            bg.classList.add("active");
            img.classList.add("activeMoveCat");
            await sleep(150);
            setEffect(0);
            await sleep(150);
            bg.classList.remove("active");

            setEffect(2);
            await sleep(150);
            setEffect(1);
            
            await sleep(10850);
            setEffect(0);
            img.classList.remove("activeMoveCat");
        })();
    }, []);

    return (
        <div className={`o-overlay ${isFading ? "hide" : ""}`}>
            <div className="o-content">
                <img src="pictures/Oiiaiu.png" alt="Oiiaiu" />
                <div className="o-bg-spread" />
                <div className="o-img" />

                {effect === 1 && <div className="retro-screen" />}
                {effect === 2 && <div className="retro-scanline" />}
                {effect === 3 && <div className="retro-chromatic" />}
                {effect === 4 && <div className="retro-flash" />}
            </div>
        </div>
    );
};

export default PlayOiiaiu;
