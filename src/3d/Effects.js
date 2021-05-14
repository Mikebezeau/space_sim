import React from "react";
import { useRef, useEffect } from "react";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { GlitchPass } from "./GlitchPass";
import useStore from "../stores/store";

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  UnrealBloomPass,
  FilmPass,
  GlitchPass,
});

export default function Effects() {
  const composer = useRef();
  const glitch = useRef();
  const health = useStore((state) => state.health);
  const { scene, gl, size, camera } = useThree();
  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  );
  useFrame(() => {
    glitch.current.factor += (1 - health / 100 - glitch.current.factor) * 0.1;
    composer.current.render();
  }, 2);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass attachArray="passes" args={[undefined, 0.8, 1, 0]} />
      <filmPass attachArray="passes" args={[0.05, 0.5, 1500, false]} />
      <glitchPass ref={glitch} attachArray="passes" />
    </effectComposer>
  );
}
