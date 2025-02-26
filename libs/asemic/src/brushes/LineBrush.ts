import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Mesh,
  NormalBlending,
} from "three";
import { BrushBuilder } from "../builders/BrushBuilder";
import { MeshBasicNodeMaterial } from "three/webgpu";
import {
  float,
  Fn,
  PI2,
  rotateUV,
  select,
  varying,
  vec2,
  vec4,
  vertexIndex,
} from "three/tsl";

export default class LineBrush<
  K extends Record<string, any>,
> extends BrushBuilder<"line", K> {
  render() {
    const { getBezier, instancesPerCurve } = this.useCurve();
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute([], 3));
    const indexGuide = [0, 1, 2, 1, 2, 3];

    let currentIndex = 0;
    const indexes: number[] = [];

    for (let i = 0; i < this.settings.maxCurves; i++) {
      if (this.settings.adjustEnds === "loop") {
        const curveStart = currentIndex;
        for (let i = 0; i < instancesPerCurve - 2; i++) {
          indexes.push(...indexGuide.map((x) => x + currentIndex));
          currentIndex += 2;
        }
        indexes.push(
          currentIndex,
          currentIndex + 1,
          curveStart,
          currentIndex + 1,
          curveStart,
          curveStart + 1,
        );
        currentIndex += 2;
      } else {
        for (let i = 0; i < instancesPerCurve - 1; i++) {
          indexes.push(...indexGuide.map((x) => x + currentIndex));
          currentIndex += 2;
        }
      }
      currentIndex += 2;
    }
    geometry.setIndex(indexes);
    const material = new MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false,
      blending: NormalBlending,
      side: DoubleSide,
      color: "white",
    });
    material.mrtNode = this.settings.renderTargets;

    const position = vec2().toVar("thisPosition");
    const rotation = float(0).toVar("rotation");
    const thickness = float(0).toVar("thickness");
    const color = varying(vec4(), "color");
    const progress = varying(float(), "progress");
    const vUv = varying(vec2(), "vUv");

    const main = Fn(() => {
      getBezier(
        vertexIndex
          .div(2)
          .toFloat()
          .div(instancesPerCurve - 0.001),
        position,
        {
          rotation,
          thickness,
          color,
          progress,
        },
      );

      vUv.assign(
        vec2(
          vertexIndex.div(2).toFloat().div(instancesPerCurve),
          select(vertexIndex.modInt(2).equal(0), 0, 1),
        ),
      );

      // thickness.assign(0.1)
      position.addAssign(
        rotateUV(
          vec2(
            thickness.mul(select(vertexIndex.modInt(2).equal(0), -0.5, 0.5)),
            0,
          ),
          rotation.add(PI2.mul(0.25)),
          vec2(0, 0),
        ),
      );
      return vec4(position, 0, 1);
    });

    material.positionNode = main();

    material.colorNode = Fn(() =>
      this.settings.pointColor(varying(vec4(), "color"), {
        progress,
        builder: this,
        uv: vUv,
      }),
    )();

    material.needsUpdate = true;

    const mesh = new Mesh(geometry, material);
    this.scene.add(mesh);

    this.data.mesh = mesh;
    this.data.material = material;
    this.data.geometry = geometry;
  }

  onDispose() {
    this.scene.remove(this.data.mesh);
    this.data.material.dispose();
    this.data.geometry.dispose();
  }
}
