import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

import cityImg from '../assets/city.jpg';
import heroImg from '../assets/hero.png';

export default function WelcomePage() {
  const { scrollY } = useScroll();

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [leftPosition, setLeftPosition] = useState('44%');

  useEffect(() => {
    const updateViewport = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    const updateLeft = () => {
      const width = window.innerWidth;
      let left;

      if (width <= 600) {
        left = 6;
      } else if (width >= 2500) {
        left = 37;
      } else {
        const breakpoints = [
          { width: 600, left: 6 },
          { width: 800, left: 12 },
          { width: 1000, left: 20 },
          { width: 1200, left: 25 },
          { width: 1400, left: 30 },
          { width: 1900, left: 34 },
          { width: 2500, left: 44 },
        ];

        for (let i = 0; i < breakpoints.length - 1; i++) {
          const bp1 = breakpoints[i];
          const bp2 = breakpoints[i + 1];

          if (width >= bp1.width && width <= bp2.width) {
            const progress = (width - bp1.width) / (bp2.width - bp1.width);
            left = bp1.left + (bp2.left - bp1.left) * progress;
            break;
          }
        }
      }

      setLeftPosition(`${left}%`);
    };

    window.addEventListener('resize', updateLeft);
    updateLeft();
    return () => window.removeEventListener('resize', updateLeft);
  }, []);

  const cityFadeEnd = viewportHeight * 0.6;
  const cityMoveEnd = viewportHeight * 0.5;

  const heroFadeEnd = viewportHeight * 0.8;
  const heroMoveEnd = viewportHeight * 0.5;

  const textScaleEnd = viewportHeight * 0.5;
  const textMoveEnd = viewportHeight;

  const opacityCity = useTransform(
    scrollY,
    [0, cityFadeEnd * 0.33, cityFadeEnd * 0.66, cityFadeEnd],
    [1, 0.6, 0.5, 0]
  );
  const yCity = useTransform(scrollY, [0, cityMoveEnd], [0, -0.15 * viewportHeight]);

  const opacityHero = useTransform(scrollY, [0, heroFadeEnd * 0.66, heroFadeEnd], [1, 1, 0]);
  const yHero = useTransform(scrollY, [0, heroMoveEnd], [0, -0.25 * viewportHeight]);

  const scaleText = useTransform(scrollY, [0, textScaleEnd], [1, viewportHeight < 500 ? 1.1 : 1.5]);
  const yText = useTransform(
    scrollY,
    [0, textScaleEnd * 0.5, textScaleEnd * 0.75, textMoveEnd],
    [0, 0.05 * viewportHeight, 0.1 * viewportHeight, 0.3 * viewportHeight]
  );

  return (
    <>
      <header id="welcome-header">
        <motion.div
          id="welcome-header-content"
          style={{
            scale: scaleText,
            y: yText,
            left: leftPosition,
            position: 'absolute',
            transition: 'left 0.2s ease-in-out',
          }}
        >
          <h1>Ready for a challenge?</h1>
          <Link id="cta-link" to="/challenges">
            Get Started
          </Link>
        </motion.div>

        <motion.img
          style={{ opacity: opacityCity, y: yCity }}
          src={cityImg}
          alt="A city skyline touched by sunlight"
          id="city-image"
        />

        <motion.img
          src={heroImg}
          style={{ opacity: opacityHero, y: yHero }}
          alt="A superhero wearing a cape"
          id="hero-image"
        />
      </header>

      <main id="welcome-content">
        <section>
          <h2>There&apos;s never been a better time.</h2>
          <p>
            With our platform, you can set, track, and conquer challenges at your own pace. Whether it&apos;s personal
            growth, professional achievements, or just for fun, we&apos;ve got you covered.
          </p>
        </section>

        <section>
          <h2>Why Challenge Yourself?</h2>
          <p>
            Challenges provide a framework for growth. They push boundaries, test limits, and result in genuine
            progress. Here, we believe everyone has untapped potential, waiting to be unlocked.
          </p>
        </section>

        <section>
          <h2>Features</h2>
          <ul>
            <li>Custom challenge creation: Set the rules, define your pace.</li>
            <li>Track your progress: See your growth over time with our analytics tools.</li>
            <li>Community Support: Join our community and get motivated by peers.</li>
          </ul>
        </section>

        <section>
          <h2>Join Thousands Embracing The Challenge</h2>
          <p>
            “I never realized what I was capable of until I set my first challenge here. It&apos;s been a transformative
            experience!” - Alex P.
          </p>
        </section>
      </main>
    </>
  );
}
