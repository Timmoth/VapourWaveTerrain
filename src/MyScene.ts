import * as THREE from "three";
import { BufferGeometry } from "three";
import { createNoise2D } from "../node_modules/simplex-noise/dist/esm/simplex-noise";

export default class MyScene extends THREE.Scene {
  geometry: THREE.PlaneGeometry;
  material: THREE.MeshBasicMaterial;
  plane: THREE.Mesh;
  startOff: number;
  noise: any;
  yOff: number;
  wireframe: THREE.LineSegments;
  stars: THREE.Points;

  constructor() {
    super();
    this.noise = createNoise2D();

    this.geometry = new THREE.PlaneGeometry(20, 20, 64, 64);

    this.material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      flatShading: true,
    });

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.add(this.plane);

    var geo = new THREE.WireframeGeometry(this.geometry);

    var mat = new THREE.LineBasicMaterial({ color: 0xb967ff, linewidth: 4 });

    this.wireframe = new THREE.LineSegments(geo, mat);

    this.add(this.wireframe);
    this.plane.rotation.x = -Math.PI / 3;
    this.plane.position.z = -25;
    this.plane.position.y = 5;
    this.plane.scale.x = 5;
    this.plane.scale.y = 7;
    this.plane.scale.z = 2;

    this.wireframe.rotation.x = -Math.PI / 3;
    this.wireframe.position.z = -25;
    this.wireframe.position.y = 5;
    this.wireframe.scale.x = 5;
    this.wireframe.scale.y = 7;
    this.wireframe.scale.z = 2;

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-10, 15, 50);
    this.add(light);

    this.startOff = 0;
    this.yOff = 0;
    this.generateStars();
  }

  update() {
    this.yOff += 0.008;
    this.startOff += 0.001;

    this.updateGeometry(this.plane.geometry);
    this.updateGeometry(this.wireframe.geometry);
    this.stars.rotation.x += 0.0005;
  }

  updateGeometry(geometry: BufferGeometry) {
    var positionAttribute = geometry.attributes.position;

    for (var i = 0; i < positionAttribute.count; i++) {
      var x = positionAttribute.getX(i);
      var y = positionAttribute.getY(i);
      var zMul = Math.pow(Math.sin(x / 1.2 - Math.PI / 2) + 1, 1.2);
      var z = (this.noise(x / 2, (y + this.yOff) / 2) + 1) * zMul * 2;
      positionAttribute.setXYZ(i, x, y, z);
    }
    positionAttribute.needsUpdate = true;
  }

  generateStars() {
    var materialOptions = {
      size: 1.0,
      opacity: 0.7,
    };

    const vertices = [];
    for (var i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);

      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    this.stars = new THREE.Points(
      geometry,
      new THREE.PointsMaterial(materialOptions)
    );
    this.add(this.stars);
  }
}
