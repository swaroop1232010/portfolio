import Lenis from "lenis";
import { gsap } from "gsap";
import { useEffect } from "react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel) as unknown as T[]);

/** Wires up Lenis smooth scroll and every GSAP animation on the page. */
export function useMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    // ---------- Smooth scroll ----------
    let lenis: Lenis | null = null;
    if (!reduced) {
      // Higher lerp = closer to native scrolling: smooth, but responsive rather than floaty.
      lenis = new Lenis({ lerp: 0.16, wheelMultiplier: 1.05, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        gsap.ticker.remove(raf);
        lenis!.destroy();
      });
    }

    const onAnchor = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const target = a.getAttribute("href");
      if (!target || !target.startsWith("#")) return;
      e.preventDefault();
      const el = target === "#top" ? 0 : (document.querySelector(target) as HTMLElement);
      if (lenis) lenis.scrollTo(el, { duration: 1.1, offset: 0 });
      else if (el === 0) window.scrollTo({ top: 0 });
      else el?.scrollIntoView();
    };
    $<HTMLAnchorElement>("[data-scroll-to]").forEach((a) => {
      a.addEventListener("click", onAnchor);
      cleanups.push(() => a.removeEventListener("click", onAnchor));
    });

    const ctx = gsap.context(() => {
      // ---------- Preloader → hero intro ----------
      const loader = document.querySelector<HTMLElement>("[data-loader]");
      const count = document.querySelector<HTMLElement>("[data-loader-count]");
      const heroTitleLines = $(".hero__title .line__inner");
      const counter = { v: 0 };
      lenis?.stop();

      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .to(counter, {
          v: 100,
          duration: reduced ? 0.2 : 1.1,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count) count.textContent = String(Math.round(counter.v));
          },
        })
        .to(".loader__content", { yPercent: -120, opacity: 0, duration: 0.5, ease: "power3.in" })
        .to(".loader__panel", { yPercent: -100, duration: 0.9, stagger: 0.1, ease: "expo.inOut" }, "-=0.2")
        .set(loader, { display: "none" })
        .from(heroTitleLines, { yPercent: 110, duration: 1.2, stagger: 0.1 }, "-=0.45")
        .from("[data-hero-photo]", { scale: 0, duration: 1, ease: "back.out(1.6)" }, "<0.1")
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, "<0.2")
        .from("[data-nav]", { y: -40, opacity: 0, duration: 1 }, "<")
        .from(".hero__badge", { scale: 0.6, opacity: 0, duration: 1, stagger: 0.15, ease: "back.out(1.7)" }, "<0.2")
        .add(() => lenis?.start());

      // Floating badges
      $("[data-float]").forEach((el, i) => {
        gsap.to(el, { y: -14, duration: 2.4 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });

      // Hero leaves: text drifts up and fades, photo scales down
      gsap.to(".hero__copy", {
        yPercent: -18,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // Generic parallax images
      $("[data-parallax]").forEach((el) => {
        const amt = Number(el.dataset.parallax || 10);
        gsap.fromTo(
          el,
          { yPercent: -amt / 2 },
          {
            yPercent: amt / 2,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // ---------- Marquee, sped up by scroll velocity ----------
      $("[data-marquee]").forEach((row) => {
        const dir = Number(row.dataset.marquee);
        const tween = gsap.to(row, { xPercent: -50 * dir, duration: 38, ease: "none", repeat: -1 });
        if (dir < 0) gsap.set(row, { xPercent: -50 });
        if (lenis) {
          // Leans with scroll speed (skew) and speeds up, then settles back.
          const lean = gsap.quickTo(row, "skewX", { duration: 0.5, ease: "power3" });
          const onScroll = ({ velocity }: { velocity: number }) => {
            gsap.to(tween, { timeScale: 1 + Math.min(Math.abs(velocity) / 6, 6), duration: 0.2, overwrite: true });
            gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.2 });
            lean(Math.max(-14, Math.min(14, -velocity * 0.6)));
            gsap.delayedCall(0.15, () => lean(0));
          };
          lenis.on("scroll", onScroll);
        }
      });

      // ---------- Headings: split into chars ----------
      $("[data-split]").forEach((el) => {
        const split = SplitText.create(el, { type: "lines,words", mask: "lines" });
        gsap.from(split.words, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.05,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // ---------- About: words light up as you scroll ----------
      $("[data-words]").forEach((el) => {
        const split = SplitText.create(el, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });

      // Simple reveals
      $("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // Counters
      $("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
      });

      // ---------- Experience: pinned horizontal scroll (desktop) ----------
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const track = document.querySelector<HTMLElement>("[data-exp-track]");
        const section = document.querySelector<HTMLElement>("[data-exp]");
        if (!track || !section) return;
        const distance = () => track.scrollWidth - window.innerWidth + 80;
        // Curved 3D arc: each card turns and sinks back the further it is from screen centre.
        const cards = $(".exp__card");
        const arc = () => {
          const mid = window.innerWidth / 2;
          cards.forEach((card) => {
            const r = card.getBoundingClientRect();
            const d = Math.max(-1.6, Math.min(1.6, (r.left + r.width / 2 - mid) / window.innerWidth));
            gsap.set(card, {
              rotationY: d * -32,
              z: -Math.abs(d) * 260,
              y: d * d * 60,
              opacity: 1 - Math.min(Math.abs(d) * 0.45, 0.6),
            });
          });
        };
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          onUpdate: arc,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onRefresh: arc,
          },
        });
        arc();
        gsap.to("[data-exp-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });
      mm.add("(max-width: 899px)", () => {
        $(".exp__card").forEach((card) => {
          gsap.from(card, { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: card, start: "top 90%" } });
        });
      });

      // ---------- Work: masonry columns move at different speeds ----------
      mm.add("(min-width: 900px)", () => {
        $("[data-col-speed]").forEach((col) => {
          const s = Number(col.dataset.colSpeed);
          gsap.fromTo(
            col,
            { yPercent: -s / 2 },
            {
              yPercent: s / 2,
              ease: "none",
              scrollTrigger: { trigger: ".masonry", start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      $("[data-card]").forEach((card) => {
        const media = card.querySelector(".card__media");
        const img = card.querySelector("img");
        gsap.fromTo(
          media,
          { clipPath: "inset(18% 10% 18% 10% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 20px)",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 92%" },
          },
        );
        gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 92%" } });
        gsap.from(card.querySelector(".card__body"), {
          y: 30,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          scrollTrigger: { trigger: card, start: "top 92%" },
        });

        if (finePointer && !reduced) {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
          const move = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rx(-py * 4);
            ry(px * 5);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("mousemove", move);
          card.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            card.removeEventListener("mousemove", move);
            card.removeEventListener("mouseleave", leave);
          });
        }
      });

      // ---------- Services: stacking cards shrink as the next one arrives ----------
      const stackCards = $("[data-stack-card]");
      stackCards.forEach((card, i) => {
        if (i === stackCards.length - 1) return;
        gsap.to(card, {
          scale: 0.92 + i * 0.02,
          filter: "brightness(0.78)",
          ease: "none",
          scrollTrigger: {
            trigger: stackCards[i + 1],
            start: "top 75%",
            end: "top 20%",
            scrub: true,
          },
        });
      });

      // ---------- Contact ----------
      gsap.from(".contact__mail", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact__mail", start: "top 90%" },
      });
      gsap.from(".contact__links a", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        scrollTrigger: { trigger: ".contact__links", start: "top 95%" },
      });
    });

    // ---------- Subtle magnetic buttons + article preview (mouse devices only; normal cursor) ----------
    if (finePointer && !reduced) {
      const preview = document.querySelector<HTMLElement>("[data-post-preview]");
      const previewImg = preview?.querySelector("img");
      const px = preview ? gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3" }) : null;
      const py = preview ? gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3" }) : null;

      const onMove = (e: MouseEvent) => {
        px?.(e.clientX);
        py?.(e.clientY);
      };
      window.addEventListener("mousemove", onMove);
      cleanups.push(() => window.removeEventListener("mousemove", onMove));

      $("[data-magnetic]").forEach((el) => {
        const mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
        const my = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          mx((e.clientX - (r.left + r.width / 2)) * 0.18);
          my((e.clientY - (r.top + r.height / 2)) * 0.18);
        };
        const leave = () => {
          mx(0);
          my(0);
        };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        });
      });

      if (preview && previewImg) {
        // Scrolling moves links out from under a still mouse without firing mouseleave,
        // so re-check what's under the pointer on every scroll.
        let lastX = -1;
        let lastY = -1;
        const track = (e: MouseEvent) => {
          lastX = e.clientX;
          lastY = e.clientY;
        };
        const recheck = () => {
          const under = lastX >= 0 ? document.elementFromPoint(lastX, lastY) : null;
          if (!under?.closest("[data-post-img]")) gsap.to(preview, { opacity: 0, scale: 0.85, duration: 0.25 });
        };
        window.addEventListener("mousemove", track);
        window.addEventListener("scroll", recheck, { passive: true });
        cleanups.push(() => {
          window.removeEventListener("mousemove", track);
          window.removeEventListener("scroll", recheck);
        });

        $<HTMLAnchorElement>("[data-post-img]").forEach((a) => {
          const enter = () => {
            previewImg.src = a.dataset.postImg || "";
            gsap.to(preview, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
          };
          const leave = () => gsap.to(preview, { opacity: 0, scale: 0.85, duration: 0.3 });
          a.addEventListener("mouseenter", enter);
          a.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            a.removeEventListener("mouseenter", enter);
            a.removeEventListener("mouseleave", leave);
          });
        });
      }
    }

    // Recalculate trigger positions once images have loaded
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    cleanups.push(() => window.removeEventListener("load", onLoad));

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);
}
