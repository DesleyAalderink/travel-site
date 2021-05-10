gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

const mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function animationSlides() {
  const slides = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");
  // loop over each slide
  slides.forEach((slide, index, slides) => {
    const img = slide.querySelector("img");
    const imgReveal = slide.querySelector(".reveal-img");
    const textReaveal = slide.querySelector(".reveal-text");
    const navTl = new gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.inOut",
      },
    });
    navTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "+=0.75");

    const slideTl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.inOut",
      },
      scrollTrigger: {
        trigger: slide,
        start: "top center",
        toggleActions: "play none none reverse",
      },
    });
    slideTl
      .fromTo(img, { scale: 2 }, { scale: 1 })
      .fromTo(imgReveal, { x: "0%" }, { x: "100%" }, "-=1")
      .fromTo(textReaveal, { x: "0%" }, { x: "100%" }, "-=0.75");

    const pageTl = gsap.timeline({
      defaults: {
        duration: 0.5,
        ease: "power2.inOut",
      },
      scrollTrigger: {
        trigger: slide,
        start: "top top",
        end: "bottom top",
        pin: true,
        scrub: true,
        markers: true,
        pinSpacing: false,
      },
    });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.to(nextSlide, { y: "50%" });
    pageTl.to(slide, { autoAlpha: 0, scale: 0.5 });
    pageTl.to(nextSlide, { y: "0" }, "-=0.5");
  });
}

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseTxt.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    mouseTxt.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100%-10%)" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100%-10%)" });
    document.body.classList.remove("hide");
  }
}

//Barba page transitions
const logo = document.querySelector("#logo");

barba.init({
  debug: true,
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animationSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        let triggers = ScrollTrigger.getAll();
        triggers.forEach((trigger) => {
          trigger.kill();
        });
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        detailAnimation();
        gsap.fromTo(
          ".nav-header",
          1,
          { y: "-100%" },
          { y: "0%", ease: "power2.inOut" }
        );
      },
      beforeLeave() {
        let triggers = ScrollTrigger.getAll();
        triggers.forEach((trigger) => {
          trigger.kill();
        });
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        //An animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //Scroll to the top
        window.scrollTo(0, 0);
        //An animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});

function detailAnimation() {
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({
      defaults: {
        duration: 1,
      },
      scrollTrigger: {
        trigger: slide,
        start: "top top",
        end: "bottom top",
        pin: true,
        scrub: true,
        markers: true,
        pinSpacing: false,
      },
    });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });
  });
}

//Event listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);

animationSlides();
