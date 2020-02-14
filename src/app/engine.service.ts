import { Injectable, NgZone, ElementRef, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader';
import { BufferGeometryUtils, DoubleSide, CameraHelper } from 'three';
import { GameService } from './game.service';
import { GameDirection } from './GameDirection';
import { GameState } from './GameState';


@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {

  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private pointLight: THREE.PointLight;
  private snake: THREE.Mesh;
  private candy: THREE.Mesh;
  private composer: EffectComposer;
  private currentDirection;
  private frameId: number = null;
  private score = 0;
  private snakeSize;
  //   private $on = document.addEventListener.bind(document);
  //   private xmouse
  //   private ymouse;

  //   $on('mousemove', function (e) {
  //     xmouse = e.clientX || e.pageX;
  //     ymouse = e.clientY || e.pageY;
  // });

  public constructor(private ngZone: NgZone, private gameService: GameService) {
    this.handleGameEvents();
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    this.scene.remove.apply(this.scene, this.scene.children);
    this.setGameElements();
    this.gameService.setScore(this.score);
    this.score = 0;
  }

  handleGameEvents() {
    this.gameService.selectedDirection.subscribe(direction => {
      this.updateSnakeRotation(direction);
    });
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: false,    // transparent background
      antialias: false // smooth edges
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    // create the scene
    this.scene = new THREE.Scene();
    const fov = 75;
    const near = 10;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, this.canvas.clientWidth / this.canvas.clientHeight, near, far);

    // soft white light
    this.light = new THREE.AmbientLight(0xcccccc, 0.3);

    this.pointLight = new THREE.PointLight(0xffffff, 0.8);

    const candyGeometry = new THREE.SphereBufferGeometry(1, 32, 16, 0, 360);
    const candyMaterial = new THREE.MeshToonMaterial({ side: DoubleSide, color: 0x741B47 });
    this.candy = new THREE.Mesh(candyGeometry, candyMaterial);

    const snakeHeadGeometry = new THREE.CylinderBufferGeometry(1.3, 2.7, 2.28, 10, 4);

    const snakeBodyGeometry = new THREE.BoxGeometry(15, 5);
    // const snakeBodyGeometry = new THREE.TorusBufferGeometry( 10, 3, 256, 32, 100);
    const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const head = new THREE.Mesh(snakeHeadGeometry, material);
    this.snake = new THREE.Mesh(snakeBodyGeometry, material);
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const greyScale = new ShaderPass(LuminosityShader);
    this.composer.addPass(greyScale);

    const sobel = new ShaderPass(SobelOperatorShader);
    // tslint:disable-next-line: no-string-literal
    sobel.uniforms['resolution'].value.x = this.canvas.clientWidth * 2;
    // tslint:disable-next-line: no-string-literal
    sobel.uniforms['resolution'].value.y = this.canvas.clientHeight * 2;
    this.composer.addPass(sobel);
    this.composer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.composer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.snakeSize = new THREE.Box3();
    this.setGameElements();
  }

  setGameElements() {
    this.camera.position.set(0, 0, 75);
    this.scene.add(this.light);
    this.camera.add(this.pointLight);
    this.scene.add(this.camera);
    this.snake.position.set(0, 0, 0);
    this.snake.scale.setX(1);
    this.generateCandyPosition();
    this.scene.add(this.snake);
    this.scene.add(this.candy);
    this.snakeSize.setFromObject(this.snake);
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        // window.addEventListener('mousemove', (e) => {
        //   this.snakeFollowMouse(this.canvas, e);
        //   // this.moveBasedOnPosition(pos);
        // });
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
      window.addEventListener('resize', () => {
        this.resize();
      });
      window.addEventListener('keydown', (e) => {
        this.checkKey(e);
      });
    });
  }

  checkKey(e: KeyboardEvent) {
    if (e.code === 'ArrowUp') {
      this.gameService.setDirection(GameDirection.Up);
      this.moveSnake(GameDirection.Up);
      e.preventDefault();
    } else if (e.code === 'ArrowDown') {
      this.gameService.setDirection(GameDirection.Down);
      this.moveSnake(GameDirection.Down);
      e.preventDefault();
    } else if (e.code === 'ArrowLeft') {
      this.gameService.setDirection(GameDirection.Left);
      this.moveSnake(GameDirection.Left);
      e.preventDefault();
    } else if (e.code === 'ArrowRight') {
      this.gameService.setDirection(GameDirection.Right);
      this.moveSnake(GameDirection.Right);
      e.preventDefault();
    }
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    this.composer.render();
    // this.renderer.render(this.scene,this.camera)
    if (this.currentDirection) {
      this.moveSnake(this.currentDirection);
    }


    if (this.detectCollisionCubes(this.snake, this.candy)) {
      this.gameService.setScore(this.score += 11);
      this.generateCandyPosition();
      this.snake.scale.x += 0.3;
      this.snake.translateY(0.3 / 2);
      this.snakeSize.setFromObject(this.snake);
    }
  }

  isOutOfCanvas(): boolean {
    const actualPos = this.extractSnakeCoordinates();
    const maxSnake = ((this.snakeSize.max.x - this.snakeSize.min.x) * 2);
    if (actualPos.x <= 0 + maxSnake || actualPos.x > (this.canvas.clientWidth - maxSnake)
      || (actualPos.y > this.canvas.clientHeight - maxSnake) || actualPos.y <= 0 + maxSnake) {
      return true;
    } else {
      return false;
    }
  }

  detectCollisionCubes(object1, object2): boolean {
    object1.geometry.computeBoundingBox();
    object2.geometry.computeBoundingBox();
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();
    const box1 = object1.geometry.boundingBox.clone();
    box1.applyMatrix4(object1.matrixWorld);
    const box2 = object2.geometry.boundingBox.clone();
    box2.applyMatrix4(object2.matrixWorld);
    return box1.intersectsBox(box2);
  }

  rotateObject(object, degreeZ = 0) {
    object.rotateZ(THREE.Math.degToRad(degreeZ));
  }


  generateCandyPosition() {
    const vector = new THREE.Vector3();
    vector.x = ((Math.floor(Math.random() * ((this.canvas.clientWidth)) + 10) / this.canvas.clientWidth) * 2) - 1;
    vector.y = (-(Math.floor(Math.random() * ((this.canvas.clientHeight)) + 10) / this.canvas.clientHeight) * 2) + 1;
    vector.z = 0.5;
    vector.unproject(this.camera);
    vector.sub(this.camera.position).normalize();
    const distance = - this.camera.position.z / vector.z;
    const scaled = vector.multiplyScalar(distance);
    const coords = this.camera.position.clone().add(scaled);
    this.candy.position.copy(coords);
  }


  snakeFollowMouse(canvas: HTMLCanvasElement, evt: MouseEvent) {
    evt.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const xPos = evt.clientX - rect.left;
    const yPos = evt.clientY - rect.top;

    const vector = new THREE.Vector3();
    vector.x = ((xPos / canvas.clientWidth) * 2) - 1;
    vector.y = (-(yPos / canvas.clientHeight) * 2) + 1;
    vector.z = 0.5;
    vector.unproject(this.camera);
    vector.sub(this.camera.position).normalize();
    const distance = - this.camera.position.z / vector.z;
    const scaled = vector.multiplyScalar(distance);
    const coords = this.camera.position.clone().add(scaled);
    coords.y += 10;
    coords.x -= this.snakeSize.max.x / 2;
    this.snake.position.copy(coords);
  }

  extractSnakeCoordinates(): THREE.Vector3 {
    let pos = new THREE.Vector3();
    pos = pos.setFromMatrixPosition(this.snake.matrixWorld);
    pos.project(this.camera);

    const widthHalf = this.canvas.clientWidth / 2;
    const heightHalf = this.canvas.clientHeight / 2;

    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = - (pos.y * heightHalf) + heightHalf;
    pos.z = 0;
    return pos;
  }


  moveSnake(direction: GameDirection) {
    this.updateSnakeRotation(direction);
    switch (direction) {
      case GameDirection.Left:
        this.snake.position.setX(this.snake.position.x - 0.4);
        break;
      case GameDirection.Right:
        this.snake.position.setX(this.snake.position.x + 0.4);
        break;
      case GameDirection.Up:
        this.snake.position.setY(this.snake.position.y + 0.2);
        break;
      case GameDirection.Down:
        this.snake.position.setY(this.snake.position.y - 0.2);
        break;
      default:
        break;
    }
    if (this.isOutOfCanvas()) {
      // tslint:disable-next-line: no-shadowed-variable
      new THREE.FontLoader().load('assets/helvetiker_bold.typeface.json', (font) => {
        const colored = new THREE.Color(0xffff00);
        const matDark = new THREE.MeshBasicMaterial({ color: colored, side: DoubleSide });
        const message = 'Game over';
        const shapes = font.generateShapes(message, 10, 10);
        const geometry = new THREE.ShapeBufferGeometry(shapes);
        geometry.computeBoundingBox();
        const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(xMid, 0, 0);
        const text = new THREE.Mesh(geometry, matDark);
        this.scene.add(text);
        this.composer.render();
        this.gameService.setState(GameState.Ended);
      });

    }
  }

  updateSnakeRotation(direction: GameDirection) {
    if (direction === this.currentDirection) {
      return;
    }
    switch (direction) {
      case GameDirection.Left:
      case GameDirection.Right:
        if (this.currentDirection === GameDirection.Up || this.currentDirection === GameDirection.Down) {
          this.snake.rotateZ(THREE.Math.degToRad(90));
        }
        break;
      case GameDirection.Up:
      case GameDirection.Down:
        if (this.currentDirection === GameDirection.Left || this.currentDirection === GameDirection.Right) {
          this.snake.rotateZ(THREE.Math.degToRad(90));
        }
        break;
      default:
        break;
    }
    this.currentDirection = direction;
  }

  public resize(): void {
    const canvas = this.composer.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.clientWidth !== width || canvas.clientHeight !== height) {
      this.composer.setSize(width, height);
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      // set render target sizes here
    }
  }
}

