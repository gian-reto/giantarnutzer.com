"use client";

import { Box3, Group, NoToneMapping, Color as TColor } from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Center, Instances } from "@react-three/drei";
import { Color, Depth, Fresnel, LayerMaterial, Noise } from "lamina/vanilla";
import { SpringValue, animated, easings, useSpring } from "@react-spring/three";
import { useDebounce, useMeasure } from "react-use";
import { useMemo, useRef, useState } from "react";

import FontData from "@compai/font-source-code-pro/data/typefaces/normal-400.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { cx } from "class-variance-authority";

extend({ TextGeometry, LayerMaterial });

export type ThreeText = {
  children: string;
  className?: string;
  lineColor?: string;
};

export const ThreeText = ({ children, className, lineColor }: ThreeText) => {
  const letters = useMemo(
    () =>
      children.split("").map((letter, index) => ({
        letter,
        material: materials[index % materials.length],
        offset: {
          x: index * 4,
        },
        animationDuration: randomIntegerInInterval(1000, 2000),
      })),
    [children]
  );

  return (
    <Container letters={letters} className={className} lineColor={lineColor} />
  );
};

type ContainerProps = {
  letters: LetterProps[];
  className?: string;
  lineColor?: string;
};

const Container = ({ letters, className, lineColor }: ContainerProps) => {
  const [spring, springRef] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { mass: 10, tension: 1000, friction: 300, precision: 0.0001 },
  }));

  const [
    [debouncedContainerWidth, debouncedContainerHeight],
    setDebouncedContainerSize,
  ] = useState([0, 0]);

  const [containerRef, { width: containerWidth, height: containerHeight }] =
    useMeasure();

  useDebounce(
    () => {
      setDebouncedContainerSize([containerWidth, containerHeight]);
    },
    500,
    [containerWidth, containerHeight]
  );

  return (
    <div
      className={className}
      // @ts-expect-error
      ref={containerRef}
    >
      <div
        style={{
          width: debouncedContainerWidth,
          height: debouncedContainerHeight,
        }}
        onMouseMove={({ clientX, clientY }) => {
          const x = (clientX / window.innerWidth) * 2 - 1;
          const y = -(clientY / window.innerHeight) * 2 + 1;
          springRef.start({
            rotation: [y / 5, x / 5, 0],
          });
        }}
        onTouchMove={({ touches }) => {
          const x = (touches[0].clientX / window.innerWidth) * 2 - 1;
          const y = -(touches[0].clientY / window.innerHeight) * 2 + 1;

          springRef.start({
            rotation: [y / 5, x / 5, 0],
          });
        }}
      >
        <Canvas
          shadows
          orthographic
          linear
          camera={{ position: [0, 15, 10], zoom: 50 }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            toneMapping: NoToneMapping,
          }}
        >
          <Content letters={letters} spring={spring} lineColor={lineColor} />
        </Canvas>
      </div>
      <div
        className={cx(
          "absolute bottom-0 w-full pointer-events-none h-1/4",
          "bg-gradient-to-t from-amber-50 to-amber-50/0",
          "dark:from-neutral-900 dark:to-neutral-900/0"
        )}
      />
    </div>
  );
};

type ContentProps = {
  letters: LetterProps[];
  lineColor?: string;
  spring: {
    rotation: SpringValue<number[]>;
  };
};

const Content = ({ letters: letterProps, spring, lineColor }: ContentProps) => {
  const contentRef = useRef<Group | null>(null);

  const {
    camera,
    size: { width, height },
  } = useThree();

  //Zoom camera to fit content
  useFrame(() => {
    const bounds =
      contentRef.current && new Box3().setFromObject(contentRef.current);

    if (bounds) {
      camera.zoom = Math.max(
        Math.min(
          Math.min(
            width / (bounds.max.x - bounds.min.x),
            height / (bounds.max.y - bounds.min.y)
          ),
          45 // Fixed max zoom
        ) - 5, // Additional offset to leave some space on the sides
        0 // Prevent zoom from going negative
      );
    }

    camera.updateProjectionMatrix();
  });

  const letterComponents = useMemo(
    () =>
      letterProps.map((letterProps, index) => (
        <Letter key={`${letterProps.letter}:${index}`} {...letterProps} />
      )),
    [letterProps]
  );

  return (
    <animated.group {...(spring as any)}>
      <Center
        ref={contentRef}
        scale={[1, 1, 2]}
        front
        top
        position={[0, -1, 2.25]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {letterComponents}
      </Center>
      <Grid lineColor={lineColor} />
    </animated.group>
  );
};

type LetterProps = {
  letter: string;
  material: LayerMaterial;
  offset: {
    x: number;
  };
  animationDuration: number;
};

const Letter = ({
  letter,
  material,
  offset,
  animationDuration,
}: LetterProps) => {
  const spring = useSpring({
    from: { position: [0 + offset.x, 0, 0] },
    to: { position: [0 + offset.x, 1, 0] },
    loop: { reverse: true },
    config: {
      duration: animationDuration,
      easing: easings.easeInOutQuad,
    },
  });

  return (
    <animated.mesh
      scale={0.1}
      geometry={
        new TextGeometry(letter, {
          font,
          size: 50,
          height: 0.2,
          curveSegments: 32,
          bevelEnabled: true,
          bevelThickness: 3,
          bevelSize: 2,
          bevelOffset: 0,
          bevelSegments: 16,
        })
      }
      {...(spring as any)}
    >
      {/* @ts-expect-error */}
      <textGeometry
        args={[
          letter,
          {
            font,
            size: 50,
            height: 0.2,
            curveSegments: 32,
            bevelEnabled: true,
            bevelThickness: 3,
            bevelSize: 2,
            bevelOffset: 0,
            bevelSegments: 16,
          },
        ]}
      />
      {/* @ts-expect-error */}
      <layerMaterial {...material} />
    </animated.mesh>
  );
};

type GridProps = {
  size?: number;
  lineWidth?: number;
  height?: number;
  lineColor?: string;
};

const Grid = ({
  size = 80,
  lineWidth = 0.1,
  height = 1,
  lineColor = "black",
}: GridProps) => {
  const threeLineColor = new TColor(lineColor);

  return (
    <Instances position={[0, -1, 0]}>
      <planeGeometry args={[lineWidth, height]} />
      <meshBasicMaterial />
      <gridHelper
        args={[size, size / 2, threeLineColor, threeLineColor]}
        position={[0, 0, 0]}
      />
    </Instances>
  );
};

const font = new FontLoader().parse(FontData);

const letterColors = [
  ["#8AB8D5", "#004FE1"],
  ["#324BE0", "#DEA8BE"],
  ["#AE3A7A", "#F3A467"],
  ["#EB824D", "#FFCF48"],
  ["#d8cf59", "#52da9c"],
];

const materials = letterColors.map(([colorA, colorB]) => {
  const threeColorA = new TColor(colorA).convertSRGBToLinear();
  const threeColorB = new TColor(colorB).convertSRGBToLinear();
  const fresnel = new TColor("white").convertSRGBToLinear();

  return new LayerMaterial({
    layers: [
      new Color({ color: threeColorA }),
      new Depth({
        colorA: threeColorA,
        colorB: threeColorB,
        alpha: 1,
        mode: "add",
        near: 0,
        far: 5,
        origin: [0, 0, 0],
      }),
      new Fresnel({
        mode: "add",
        color: fresnel,
        intensity: 0.75,
        power: 2.5,
        bias: 0.0,
        alpha: 0.25,
      }),
      new Noise({
        mapping: "local",
        type: "perlin",
        scale: 50,
        colorA: "white",
        colorB: "black",
        mode: "darken",
        alpha: 0.05,
      }),
    ],
  });
});

const randomIntegerInInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
