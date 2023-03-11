export const IntroSection = () => {
  return (
    <>
      <p className="text-xl font-normal !leading-relaxed sm:text-2xl md:text-4xl text-neutral-500 dark:text-neutral-500">
        <span className="text-neutral-900 dark:text-neutral-100">
          I'm Gian, a software engineer based in Switzerland.
        </span>{" "}
        Currently working @{" "}
        <a
          href="https://threema.ch/en"
          className="underline transition-colors underline-offset-8 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          Threema
        </a>
        . Perviously at Zemp, Werbekontor, and Vorsorgestiftung der Basler
        Versicherung.
      </p>
    </>
  );
};
