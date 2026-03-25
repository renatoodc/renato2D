import Phaser from 'phaser';
import Interactable from '../entities/Interactable';
import Player from '../entities/Player';

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactables!: Phaser.Physics.Arcade.StaticGroup;
  
  private virtualJoystick = { x: 0, y: 0 };
  private activeInteractable: Interactable | null = null;
  private isEditorEnabled: boolean = false;
  private selectedEditorObject: Phaser.GameObjects.Image | null = null;
  private isDriving = false;
  private ferrariObj!: Phaser.Physics.Arcade.Image;
  private mar: any = null;
  private editorPanel!: HTMLElement;
  private editorStatusText!: Phaser.GameObjects.Text;
  private selectionBox!: Phaser.GameObjects.Graphics;
  private interactionRangeGraphics!: Phaser.GameObjects.Graphics;
  private isPaintMode: boolean = false;
  private isEyedropperMode: boolean = false;
  private paintTool: 'brush' | 'rect' | 'circle' | 'eraser' = 'brush';
  private paintColor: number = 0xffffff;
  private paintBrushSize: number = 20;
  private floorLayer!: Phaser.GameObjects.Image;
  private floorCanvas!: Phaser.Textures.CanvasTexture;
  private paintStrokes: Array<{ type: string, points: number[], color: number, size: number }> = [];
  private currentStroke: { type: string, points: number[], color: number, size: number } | null = null;
  
  private initialScaleX = 1;
  private initialScaleY = 1;
  private dragStartX = 0;
  private dragStartY = 0;

  constructor() {
    super('GameScene');
  }

  create() {
    console.log("%c[MAP EDITOR] v4.0 - Ultimate Restoration", "color: #00ffff; font-weight: bold;");
    const worldW = 4000;
    const worldH = 12490;
    const worldStartY = 5704;

    this.floorCanvas = this.textures.createCanvas('paint_floor', worldW, worldH - worldStartY) as Phaser.Textures.CanvasTexture;
    this.floorLayer = this.add.image(0, worldStartY, 'paint_floor').setOrigin(0, 0).setDepth(1);
    this.interactables = this.physics.add.staticGroup();

    // SPRAWN API - Improved to handle filenames and keys
    (window as any).spawn = (assetKey: string, x?: number, y?: number) => {
      let key = assetKey;
      // If user passed a filename like 'agua.png', try to extract the key
      if (key.includes('.')) key = key.split('.')[0].replace(/\s/g, '_');
      
      // Fallback: search textures by source name if key doesn't work
      if (!this.textures.exists(key)) {
         const found = this.textures.getTextureKeys().find(tk => tk.includes(assetKey.split('.')[0]));
         if (found) key = found;
      }

      let sX = x ?? (this.player ? this.player.x : this.cameras.main.scrollX + this.cameras.main.width/2);
      let sY = y ?? (this.player ? this.player.y : this.cameras.main.scrollY + this.cameras.main.height/2);
      
      let newObj: any;
      if (key === 'concha') {
        newObj = new Interactable(this, sX, sY, 'concha', { speaker: 'Concha', text: 'Você encontrou uma concha!' });
        this.interactables.add(newObj);
        newObj.body.updateFromGameObject();
        newObj.setDepth(20);
      } else if (this.textures.exists(key)) {
        newObj = this.add.image(sX, sY, key);
      } else {
        console.error(`[MAP EDITOR] Texture not found: ${assetKey} (tried key: ${key})`);
        return null;
      }
      
      const floorKeys = ['rua_melhor', 'calcadao', 'orla', 'sand', 'water', 'agua'];
      newObj.setDepth(floorKeys.includes(key) ? 2 : 20);
      newObj.setOrigin(0.5, 0.5).setInteractive({ draggable: true });
      this.input.setDraggable(newObj);
      console.log(`[MAP EDITOR] Spawned: ${key} at ${Math.round(sX)}, ${Math.round(sY)}`);
      return newObj;
    };

    // SYSTEM API - Revert to original key
    (window as any).saveMap = () => {
      const objectsData = this.children.list
        .filter(child => (child instanceof Phaser.GameObjects.Image || child instanceof Phaser.GameObjects.Rectangle || child instanceof Phaser.GameObjects.TileSprite) && child.input?.draggable && child !== this.floorLayer)
        .map(child => {
          const obj = child as any;
          return {
            type: child instanceof Phaser.GameObjects.Rectangle ? 'box' : (child instanceof Phaser.GameObjects.TileSprite ? 'tile' : 'image'),
            key: obj.texture?.key || 'box',
            x: Math.round(obj.x), y: Math.round(obj.y),
            scaleX: parseFloat(obj.scaleX.toFixed(3)), scaleY: parseFloat(obj.scaleY.toFixed(3)),
            rotation: parseFloat(obj.rotation.toFixed(3)), depth: obj.depth
          };
        });
      localStorage.setItem('map_layout', JSON.stringify({ objects: objectsData, paintStrokes: this.paintStrokes }));
      console.log("[MAP EDITOR] Saved to map_layout!");
    };

    (window as any).loadMap = () => {
      const saved = localStorage.getItem('map_layout');
      if (!saved) { console.log("[MAP EDITOR] No map_layout found."); return; }
      const layout = JSON.parse(saved);
      this.paintStrokes = layout.paintStrokes || [];
      this.redrawPaint();
      const matched = new Set<Phaser.GameObjects.GameObject>();
      (layout.objects || []).forEach((data: any) => {
        if (!this.textures.exists(data.key) && data.key !== 'box' && data.type !== 'tile') {
          console.warn(`[MAP EDITOR] Skipping invalid texture: ${data.key}`);
          return;
        }
        let existing = this.children.list.find(child => (child as any).texture?.key === data.key && !matched.has(child)) as any;
        if (existing) {
          const depth = data.depth || (['rua_melhor','calcadao','orla','sand','water','agua'].includes(data.key) ? 2 : 20);
          existing.setPosition(data.x, data.y).setScale(data.scaleX, data.scaleY).setRotation(data.rotation).setDepth(depth);
          matched.add(existing);
        } else {
          let spawned: any;
          if (data.type === 'tile') { 
            spawned = this.add.tileSprite(data.x, data.y, 4000, 2048, data.key).setInteractive({ draggable: true }); 
            this.input.setDraggable(spawned); 
          }
          else spawned = (window as any).spawn(data.key, data.x, data.y);
          if (spawned) { 
            const depth = data.depth || (['rua_melhor','calcadao','orla','sand','water','agua'].includes(data.key) ? 2 : 20);
            spawned.setScale(data.scaleX, data.scaleY).setRotation(data.rotation).setDepth(depth); 
            matched.add(spawned); 
          }
        }
      });
      console.log("[MAP EDITOR] Loaded from map_layout.");
    };

    (window as any).clearMap = () => {
      if (!confirm("Isso irá deletar TODOS os objetos do mapa. Tem certeza?")) return;
      this.children.list
        .filter(c => (c as any).input?.draggable && c !== this.mar)
        .forEach(c => c.destroy());
      this.paintStrokes = [];
      this.redrawPaint();
      (window as any).saveMap();
      console.log("[MAP EDITOR] Map cleared!");
    };

    (window as any).allTop = () => {
      this.children.list.forEach(c => { if((c as any).input?.draggable && c !== this.floorLayer) (c as any).setDepth(30000); });
    };

    (window as any).rescue = () => {
      this.children.list.forEach(c => { 
        if((c as any).input?.draggable && c !== this.floorLayer) {
           const k = (c as any).texture?.key;
           (c as any).setDepth(['rua_melhor','calcadao','orla','sand','water','agua'].includes(k) ? 2 : 20);
        }
      });
    };

    this.selectionBox = this.add.graphics().setDepth(10000);
    this.interactionRangeGraphics = this.add.graphics().setDepth(5);
    this.createEditorUI();
    // MAP CORE - Replaced mar.gif with stable deep blue
    this.cameras.main.setBackgroundColor('#87CEEB');
    this.mar = this.add.rectangle(worldW/2, worldH, 4000, 4000, 0x003366).setOrigin(0.5,1).setDepth(-10).setInteractive({draggable:true});
    this.input.setDraggable(this.mar);
    
    this.ferrariObj = this.physics.add.image(1232, 10196, 'ferrari').setOrigin(0.5,1).setScale(0.5).setDepth(20).setInteractive({draggable:true});
    this.ferrariObj.setCollideWorldBounds(true).setImmovable(true);
    this.input.setDraggable(this.ferrariObj);
    
    // RECOVERY
    (window as any).loadMap();

    // ZOOM KEYS (+/-)
    this.input.keyboard!.on('keydown-PLUS', () => { this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom + 0.1, 0.2, 5); });
    this.input.keyboard!.on('keydown-MINUS', () => { this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom - 0.1, 0.2, 5); });
    this.input.keyboard!.on('keydown-NUMPAD_ADD', () => { this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom + 0.1, 0.2, 5); });
    this.input.keyboard!.on('keydown-NUMPAD_SUBTRACT', () => { this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom - 0.1, 0.2, 5); });;

    // EDITOR STATE
    this.editorStatusText = this.add.text(20,20,'Editor: OFF',{fontSize:'32px',color:'#f00',backgroundColor:'#000'}).setScrollFactor(0).setDepth(20000).setAlpha(0);
    this.input.keyboard!.on('keydown-E', () => {
      this.isEditorEnabled = !this.isEditorEnabled;
      if (!this.isEditorEnabled) { this.isPaintMode = false; this.isEyedropperMode = false; }
      this.updatePaintUI();
      this.editorStatusText.setText(`Editor: ${this.isEditorEnabled?'ON':'OFF'}`).setColor(this.isEditorEnabled?'#0ff':'#f00').setAlpha(this.isEditorEnabled?1:0);
    });

    // Editor Interaction - Disabled physics during drag to avoid freezes
    this.input.on('dragstart', (p:any, g:any) => { 
      if (!this.isEditorEnabled) return; 
      g._origD = g.depth; g.setDepth(22000); 
      if (g.body) (g.body as any).enable = false;
      this.dragStartX = p.worldX; this.dragStartY = p.worldY; 
      this.initialScaleX = g.scaleX; this.initialScaleY = g.scaleY; 
    });
    this.input.on('drag', (p:any, g:any, dx:number, dy:number) => {
      if (!this.isEditorEnabled || this.isPaintMode || this.isEyedropperMode) return;
      if ((p.event as MouseEvent).altKey) {
        const sx = (p.worldX - this.dragStartX) * 0.005, sy = (p.worldY - this.dragStartY) * 0.005;
        g.setScale(Phaser.Math.Clamp(this.initialScaleX + sx, 0.1, 15), Phaser.Math.Clamp(this.initialScaleY - sy, 0.1, 15));
      } else g.setPosition(dx, dy);
    });
    this.input.on('dragend', (_p:any, g:any) => { 
        g.setDepth(g._origD || 20); 
        if (g.body) {
            (g.body as any).enable = true;
            if (g instanceof Interactable) g.refreshBody(); else (g.body as any).updateFromGameObject();
        }
    });

    this.input.on('pointermove', (p:any) => {
      if (this.isEditorEnabled && this.isPaintMode && p.isDown && this.currentStroke) {
        this.currentStroke.points.push(p.worldX, p.worldY);
        const ox = this.floorLayer.x, oy = this.floorLayer.y;
        if (this.paintTool === 'brush' || this.paintTool === 'eraser') {
            const l = this.currentStroke.points.length;
            const ctx = this.floorCanvas.context;
            ctx.save(); ctx.beginPath(); ctx.lineWidth = this.paintBrushSize; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            if (this.paintTool === 'eraser') ctx.globalCompositeOperation = 'destination-out';
            else ctx.strokeStyle = `#${this.paintColor.toString(16).padStart(6,'0')}`;
            ctx.moveTo(this.currentStroke.points[l-4]-ox, this.currentStroke.points[l-3]-oy);
            ctx.lineTo(p.worldX-ox, p.worldY-oy); ctx.stroke(); ctx.restore(); this.floorCanvas.update();
        } else this.redrawPaint();
      }
    });

    this.input.on('pointerdown', (p:any, over:any[]) => {
        if (!this.isEditorEnabled) return;
        if (this.isEyedropperMode) { this.sampleColor(p.x, p.y); return; }
        if (this.isPaintMode) {
            this.currentStroke = { type: this.paintTool, points: [p.worldX, p.worldY], color: this.paintColor, size: this.paintBrushSize };
            this.paintStrokes.push(this.currentStroke);
            const ctx = this.floorCanvas.context; ctx.save(); ctx.beginPath();
            if (this.paintTool === 'eraser') ctx.globalCompositeOperation = 'destination-out';
            else ctx.fillStyle = `#${this.paintColor.toString(16).padStart(6,'0')}`;
            ctx.arc(p.worldX-this.floorLayer.x, p.worldY-this.floorLayer.y, this.paintBrushSize/2, 0, Math.PI*2);
            ctx.fill(); ctx.restore(); this.floorCanvas.update();
            return;
        }
        this.selectedEditorObject = over.length > 0 ? over[0] : null;
    });

    this.input.on('wheel', (p:any, over:any[], _dx:number, dy:number) => {
        if (over.length > 0) {
            const o = over[0];
            if ((p.event as WheelEvent).shiftKey) o.setScale(Phaser.Math.Clamp(o.scaleX + (dy > 0 ? -0.05 : 0.05), 0.1, 15));
            else o.rotation += dy > 0 ? 0.01 : -0.01;
        } else this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom - (p.event as WheelEvent).deltaY * 0.001, 0.2, 1.5);
    });

    // PHYSICS & CAMERA BOUNDS
    this.physics.world.setBounds(0, worldStartY, worldW, worldH-worldStartY);
    this.cameras.main.setBounds(0, worldStartY, worldW, worldH-worldStartY);
    const selectedChar = this.registry.get('selectedCharacter') || 'male';
    this.player = new Player(this, worldW/2, 10196, selectedChar);
    this.player.setDepth(100);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.0);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.keyboard!.on('keydown-SPACE', this.handleInteract, this);
    this.events.on('joystickMove', (d:any) => this.virtualJoystick = d);

    // NPC Traffic Timer (Every 1 minute)
    this.time.addEvent({
      delay: 60000,
      callback: this.spawnNPCFerrari,
      callbackScope: this,
      loop: true
    });
    
    // Initial spawn
    this.spawnNPCFerrari();
  }

  update() {
    this.activeInteractable = null; this.interactionRangeGraphics.clear();
    if (this.player && this.player.active) {
        this.interactables.getChildren().forEach((o:any) => {
            const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, o.x, o.y);
            if (o.texture.key === 'concha') this.interactionRangeGraphics.lineStyle(2, 0x0f0, 0.8).strokeCircle(o.x, o.y, 200);
            if (d < 200) { this.activeInteractable = o; if (o.texture.key === 'concha') this.interactionRangeGraphics.lineStyle(4, 0x0f0, 0.5+Math.sin(this.time.now/100)*0.2).strokeCircle(o.x, o.y, 200); }
        });
    }

    const dialogueBox = document.getElementById('dialogue-box-v2');
    const isDialogOpen = dialogueBox && dialogueBox.style.display !== 'none';
    
    if (!isDialogOpen) {
        if (this.isDriving) this.updateFerrariControls();
        else if (this.player) this.player.update(this.cursors, this.virtualJoystick);
    } else {
        if (this.player) this.player.freeze();
        if (this.ferrariObj) this.ferrariObj.setVelocity(0);
    }

    // Throttled UI update (every 100ms) to avoid DOM freezes during dragging
    if (this.time.now % 100 < 16) this.updateEditorUI();
  }

  private updateFerrariControls() {
    this.ferrariObj.setVelocity(0);
    let mx=0, my=0;
    if (this.cursors.left.isDown) mx=-1; else if (this.cursors.right.isDown) mx=1;
    if (this.cursors.up.isDown) my=-1; else if (this.cursors.down.isDown) my=1;
    if (this.virtualJoystick.x !== 0 || this.virtualJoystick.y !== 0) { mx=this.virtualJoystick.x; my=this.virtualJoystick.y; }
    if (mx!==0 || my!==0) { const l = Math.sqrt(mx*mx+my*my); this.ferrariObj.setVelocity((mx/l)*1500, (my/l)*1500).setFlipX(mx>0); }
  }

  private handleInteract() {
    const dialogueBox = document.getElementById('dialogue-box-v2');
    if (dialogueBox && dialogueBox.style.display !== 'none') return;

    if (this.isDriving) {
      this.isDriving = false;
      this.ferrariObj.setVelocity(0).setImmovable(true);
      this.player.setPosition(this.ferrariObj.x, this.ferrariObj.y+100).setVisible(true);
      if (this.player.body) (this.player.body as any).checkCollision.none = false;
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      return;
    }

    if (this.activeInteractable) {
      if (this.activeInteractable.texture.key === 'concha') {
        this.player.freeze(true);
        this.cameras.main.zoomTo(1.5, 800, 'Power2');
      }
      this.game.events.emit('showDialogue', (this.activeInteractable as any).dialogueData);
    } else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.ferrariObj.x, this.ferrariObj.y) < 150) {
      this.isDriving = true;
      this.ferrariObj.setImmovable(false);
      this.player.setVisible(false);
      if (this.player.body) (this.player.body as any).checkCollision.none = true;
      this.cameras.main.startFollow(this.ferrariObj, true, 0.1, 0.1);
    }
  }

  private createEditorUI() {
    if (document.getElementById('editor-inspector')) return;
    this.editorPanel = document.createElement('div');
    this.editorPanel.id = 'editor-inspector';
    this.editorPanel.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 15px; background: rgba(0,0,0,0.85); color: #0f0; border: 1px solid #0f0; border-radius: 8px; width: 280px; z-index: 10000; display: none; pointer-events: auto;`;
    this.editorPanel.innerHTML = `
      <div style="font-weight: bold; text-align: center;">MAP EDITOR</div>
      <div id="inspector-key" style="color: #fff; margin-bottom: 8px;">Key: -</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div>X: <span id="inspector-x">0</span></div><div>Y: <span id="inspector-y">0</span></div>
        <div>SX: <span id="inspector-scale-x">1.0</span></div><div>SY: <span id="inspector-scale-y">1.0</span></div>
        <div>Ang: <span id="inspector-angle">0.0</span></div>
        <div>Depth: <input type="number" id="inspector-depth" style="width: 50px; background: #000; color: #0f0; border: 1px solid #444;"></div>
      </div>
      <div style="margin-top: 10px; display: flex; gap: 4px;">
        <button class="tool-btn" id="tool-brush">🖌️</button><button class="tool-btn" id="tool-rect">🔲</button>
        <button class="tool-btn" id="tool-circle">⭕</button><button class="tool-btn" id="tool-eraser">🧽</button>
        <button class="tool-btn" id="tool-picker">🧪</button>
        <div id="paint-color-preview" style="width: 25px; height: 25px; border: 2px solid #fff; background: #fff;"></div>
      </div>
      <div id="palette" style="display: flex; gap: 4px; margin-top: 5px; flex-wrap: wrap;">
        ${['#fff','#000','#f00','#0f0','#00f','#ff0','#f50','#808','#0ff','#f0f'].map(c => `<div class="color-swatch" data-color="${c}" style="width: 15px; height: 15px; background: ${c}; cursor: pointer; border: 1px solid #444;"></div>`).join('')}
      </div>
      <div style="margin-top: 12px; display: flex; gap: 8px;">
        <button id="save-map-btn" style="background: #3498db; color: #fff; border: none; padding: 5px; cursor: pointer; flex: 1;">Save</button>
        <button id="clear-map-btn" style="background: #e74c3c; color: #fff; border: none; padding: 5px; cursor: pointer; flex: 1;">Clear ALL</button>
      </div>
      <div style="margin-top: 8px; display: flex; gap: 4px;">
        <button id="clear-paint-btn" style="background: #f5f; color: #fff; border: none; padding: 5px; cursor: pointer; flex: 1; font-size: 10px;">Clear Paint</button>
      </div>
      <div style="margin-top: 10px; display: flex; gap: 8px;">
        <button id="all-top-btn" style="background: #e67e22; color: #fff; border: none; padding: 5px; cursor: pointer; flex: 1; font-size: 10px;">ALL TOP</button>
        <button id="rescue-btn" style="background: #e67e22; color: #fff; border: none; padding: 5px; cursor: pointer; flex: 1; font-size: 10px;">RESCUE</button>
      </div>
    `;
    document.body.appendChild(this.editorPanel);
    const setTool = (t: any) => { if (this.paintTool === t && this.isPaintMode) this.isPaintMode = false; else { this.paintTool = t; this.isPaintMode = true; this.isEyedropperMode = false; this.selectedEditorObject = null; } this.updatePaintUI(); };
    document.getElementById('tool-brush')!.onclick = () => setTool('brush');
    document.getElementById('tool-rect')!.onclick = () => setTool('rect');
    document.getElementById('tool-circle')!.onclick = () => setTool('circle');
    document.getElementById('tool-eraser')!.onclick = () => setTool('eraser');
    document.getElementById('tool-picker')!.onclick = () => { this.isEyedropperMode = !this.isEyedropperMode; if (this.isEyedropperMode) this.isPaintMode = false; this.updatePaintUI(); };
    document.querySelectorAll('.color-swatch').forEach((s: any) => { (s as HTMLElement).onclick = () => { this.paintColor = parseInt(s.dataset.color.replace('#', '0x')); this.updatePaintUI(); }; });
    document.getElementById('clear-paint-btn')!.onclick = () => { if (confirm("Limpar tinta?")) { this.paintStrokes = []; this.redrawPaint(); } };
    document.getElementById('clear-map-btn')!.onclick = () => { (window as any).clearMap(); };
    document.getElementById('save-map-btn')!.onclick = () => { (window as any).saveMap(); alert("Salvo!"); };
    document.getElementById('all-top-btn')!.onclick = () => { (window as any).allTop(); };
    document.getElementById('rescue-btn')!.onclick = () => { (window as any).rescue(); };
    document.getElementById('inspector-depth')!.oninput = (e: any) => { if (this.selectedEditorObject) this.selectedEditorObject.setDepth(parseInt((e.target as HTMLInputElement).value) || 0); };
  }

  private updatePaintUI() {
    const cp = document.getElementById('paint-color-preview');
    if (this.isEyedropperMode) this.input.setDefaultCursor('cell'); else if (this.isPaintMode) this.input.setDefaultCursor('crosshair'); else this.input.setDefaultCursor('default');
    ['brush', 'rect', 'circle', 'eraser'].forEach(t => {
      const b = document.getElementById(`tool-${t}`); if (b) { b.style.background = (this.isPaintMode && this.paintTool === t) ? "#0f0" : "#333"; b.style.color = (this.isPaintMode && this.paintTool === t) ? "#000" : "#fff"; }
    });
    const p = document.getElementById('tool-picker'); if (p) p.style.background = this.isEyedropperMode ? "#3498db" : "#333";
    if (cp) cp.style.background = `#${this.paintColor.toString(16).padStart(6, '0')}`;
  }

  private sampleColor(x: number, y: number) {
    this.game.renderer.snapshotPixel(x, y, (pixel: any) => {
        this.paintColor = Phaser.Display.Color.GetColor(pixel.r, pixel.g, pixel.b);
        this.isEyedropperMode = false; this.isPaintMode = true; this.paintTool = 'brush'; this.updatePaintUI();
    });
  }

  private redrawPaint() {
    this.floorCanvas.clear();
    this.paintStrokes.forEach(s => {
        const ctx = this.floorCanvas.context, ox = this.floorLayer.x, oy = this.floorLayer.y;
        ctx.save(); ctx.beginPath(); ctx.lineWidth = s.size; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (s.type === 'eraser') ctx.globalCompositeOperation = 'destination-out';
        else { ctx.strokeStyle = ctx.fillStyle = `#${s.color.toString(16).padStart(6, '0')}`; }
        if (s.type === 'brush' || s.type === 'eraser') {
            if (s.points.length >= 4) { ctx.moveTo(s.points[0]-ox, s.points[1]-oy); for (let i=2; i<s.points.length; i+=2) ctx.lineTo(s.points[i]-ox, s.points[i+1]-oy); ctx.stroke(); }
            else if (s.points.length === 2) { ctx.arc(s.points[0]-ox, s.points[1]-oy, s.size/2, 0, Math.PI*2); ctx.fill(); }
        } else if (s.type === 'rect') { ctx.strokeRect(s.points[0]-ox, s.points[1]-oy, (s.points[2]||s.points[0])-s.points[0], (s.points[3]||s.points[1])-s.points[1]); }
        else if (s.type === 'circle') { ctx.arc(s.points[0]-ox, s.points[1]-oy, Phaser.Math.Distance.Between(s.points[0], s.points[1], s.points[2]||s.points[0], s.points[3]||s.points[1]), 0, Math.PI*2); ctx.stroke(); }
        ctx.restore();
    });
    this.floorCanvas.update();
  }

  private updateEditorUI() {
    if (this.isEditorEnabled) {
      if (this.editorPanel) this.editorPanel.style.display = 'block';
      const o = this.selectedEditorObject;
      const kEl = document.getElementById('inspector-key')!, xEl = document.getElementById('inspector-x')!, yEl = document.getElementById('inspector-y')!;
      const sxEl = document.getElementById('inspector-scale-x')!, syEl = document.getElementById('inspector-scale-y')!, aEl = document.getElementById('inspector-angle')!;
      const dEl = document.getElementById('inspector-depth') as HTMLInputElement;
      if (o && o.active) {
          kEl.innerText = `Key: ${(o as any).texture.key}`; xEl.innerText = Math.round(o.x).toString(); yEl.innerText = Math.round(o.y).toString();
          sxEl.innerText = o.scaleX.toFixed(2); syEl.innerText = o.scaleY.toFixed(2); aEl.innerText = o.angle.toFixed(1);
          if (dEl) dEl.value = o.depth.toString();
      } else {
          kEl.innerText = "Key: -"; xEl.innerText = "0"; yEl.innerText = "0"; sxEl.innerText = "1.0"; syEl.innerText = "1.0"; aEl.innerText = "0.0";
          if (dEl) dEl.value = "0";
      }
      this.drawSelectionBox();
    } else if (this.editorPanel) this.editorPanel.style.display = 'none';
  }

  private drawSelectionBox() {
    this.selectionBox.clear();
    if (!this.isPaintMode && !this.isEyedropperMode && this.selectedEditorObject && this.selectedEditorObject.active) {
      const o = this.selectedEditorObject; const b = o.getBounds();
      this.selectionBox.lineStyle(3, 0xffffff).strokeRect(b.x, b.y, b.width, b.height);
      this.selectionBox.fillStyle(0xffffff).fillCircle(o.x, o.y, 6).setDepth(20001);
    }
  }

  private spawnNPCFerrari() {
    console.log("[NPC] Spawning Ferrari...");
    const npc = this.physics.add.image(0, 9024, 'ferrari');
    npc.setOrigin(0.5, 1).setScale(0.5).setDepth(20).setFlipX(true);
    npc.setVelocityX(500); // 500 pixels per second
    
    // Auto-destroy when out of bounds (+ some margin)
    this.events.on('update', () => {
      if (npc.active && npc.x > 4100) {
          npc.destroy();
      }
    });
  }
}
