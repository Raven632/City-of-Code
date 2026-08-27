//JS 

 

const config = { 

    type: Phaser.AUTO, 

    parent: "game", 

    width: window.innerWidth, 

    height: window.innerHeight, 

    backgroundColor: "#4f8a5b", 

  

    scene: { 

        create: create 

    } 

}; 

  

const game = new Phaser.Game(config); 

  

  

function create() { 

  

    const width = this.scale.width; 

    const height = this.scale.height; 

  

  

    // ========================= 

    // CITY GRID 

    // ========================= 

  

    const grid = this.add.graphics(); 

  

    grid.lineStyle(1, 0xffffff, 0.15); 

  

    const cellSize = 80; 

  

    for (let x = 0; x <= width; x += cellSize) { 

        grid.lineBetween(x, 0, x, height); 

    } 

  

    for (let y = 0; y <= height; y += cellSize) { 

        grid.lineBetween(0, y, width, y); 

    } 

  

  

    // ========================= 

    // TITLE 

    // ========================= 

  

    this.add.text(30, 25, "CITY OF CODE", { 

        fontSize: "28px", 

        color: "#ffffff", 

        fontStyle: "bold" 

    }); 

  

  

    // ========================= 

    // PLACEHOLDER BUILDINGS 

    // ========================= 

  

    this.add.rectangle(200, 200, 100, 80, 0xd98c3f); 

  

    this.add.rectangle(400, 350, 120, 100, 0x777777); 

  

    this.add.rectangle(650, 180, 90, 130, 0x996633); 

  

  

    // ========================= 

    // RIGHT SIDEBAR 

    // ========================= 

  

    const sidebar = this.add.rectangle( 

        width - 25, 

        height / 2, 

        50, 

        150, 

        0x222222 

    ); 

  

    sidebar.setInteractive({ 

        useHandCursor: true 

    }); 

  

  

    const sidebarText = this.add.text( 

        width - 25, 

        height / 2, 

        "PC", 

        { 

            fontSize: "20px", 

            color: "#ffffff", 

            fontStyle: "bold" 

        } 

    ); 

  

    sidebarText.setOrigin(0.5); 

  

  

    // ========================= 

    // CLICK → OPEN MONITOR 

    // ========================= 

  

    sidebar.on("pointerdown", () => { 

  

        if (this.monitorOpen) { 

            return; 

        } 

  

        this.monitorOpen = true; 

  

        openMonitor(this); 

    }); 

} 

  

  

function openMonitor(scene) { 

  

    const width = scene.scale.width; 

    const height = scene.scale.height; 

  

  

    // Monitor covers about half the screen 

    const monitorWidth = width * 0.48; 

    const monitorHeight = height * 0.85; 

  

  

    // Starts outside screen on the right 

    const startX = width + monitorWidth / 2; 

  

    // Final position 

    const endX = width - monitorWidth / 2 - 20; 

  

    const monitorY = height / 2; 

  

  

    const monitorObjects = []; 

  

  

    // ========================= 

    // MONITOR FRAME 

    // ========================= 

  

    const frame = scene.add.rectangle( 

        startX, 

        monitorY, 

        monitorWidth, 

        monitorHeight, 

        0x111111 

    ); 

  

    frame.setStrokeStyle(8, 0x333333); 

  

    monitorObjects.push(frame); 

  

  

    // ========================= 

    // MONITOR SCREEN 

    // ========================= 

  

    const screen = scene.add.rectangle( 

        startX, 

        monitorY, 

        monitorWidth - 40, 

        monitorHeight - 50, 

        0x202020 

    ); 

  

    monitorObjects.push(screen); 

  

  

    // ========================= 

    // YELLOW STICKY NOTES 

    // ========================= 

  

    const sticky1 = scene.add.rectangle( 

        startX - monitorWidth / 2 + 50, 

        monitorY - monitorHeight / 2 + 30, 

        110, 

        70, 

        0xf6d743 

    ); 

  

    const sticky1Text = scene.add.text( 

        sticky1.x, 

        sticky1.y, 

        "START\nHERE", 

        { 

            fontSize: "14px", 

            color: "#222222", 

            align: "center" 

        } 

    ); 

  

    sticky1Text.setOrigin(0.5); 

  

    monitorObjects.push(sticky1, sticky1Text); 

  

  

    const sticky2 = scene.add.rectangle( 

        startX + monitorWidth / 2 - 50, 

        monitorY - 80, 

        110, 

        70, 

        0xf6d743 

    ); 

  

    const sticky2Text = scene.add.text( 

        sticky2.x, 

        sticky2.y, 

        "PYTHON\nHINT", 

        { 

            fontSize: "14px", 

            color: "#222222", 

            align: "center" 

        } 

    ); 

  

    sticky2Text.setOrigin(0.5); 

  

    monitorObjects.push(sticky2, sticky2Text); 

  

  

    // ========================= 

    // TASK 

    // ========================= 

  

    const task = scene.add.text( 

        startX - monitorWidth / 2 + 40, 

        monitorY - monitorHeight / 2 + 100, 

        "CURRENT TASK\nBuild your first house.", 

        { 

            fontSize: "18px", 

            color: "#ffffff", 

            lineSpacing: 10 

        } 

    ); 

  

    monitorObjects.push(task); 

  

  

    // ========================= 

    // FAKE CODE EDITOR 

    // ========================= 

  

    const editor = scene.add.rectangle( 

        startX, 

        monitorY + 30, 

        monitorWidth - 80, 

        monitorHeight * 0.35, 

        0x151515 

    ); 

  

    editor.setStrokeStyle(2, 0x555555); 

  

    const codeText = scene.add.text( 

        startX - monitorWidth / 2 + 60, 

        monitorY - 40, 

        "# Write Python code here\n\nbuild_house(2, 3)", 

        { 

            fontSize: "17px", 

            color: "#dddddd", 

            fontFamily: "monospace", 

            lineSpacing: 10 

        } 

    ); 

  

    monitorObjects.push(editor, codeText); 

  

  

    // ========================= 

    // RUN BUTTON 

    // ========================= 

  

    const runButton = scene.add.rectangle( 

        startX - monitorWidth / 2 + 110, 

        monitorY + monitorHeight / 2 - 55, 

        150, 

        45, 

        0xf6d743 

    ); 

  

    runButton.setInteractive({ 

        useHandCursor: true 

    }); 

  

    const runText = scene.add.text( 

        runButton.x, 

        runButton.y, 

        "▶ Ausführen", 

        { 

            fontSize: "16px", 

            color: "#222222", 

            fontStyle: "bold" 

        } 

    ); 

  

    runText.setOrigin(0.5); 

  

    monitorObjects.push(runButton, runText); 

  

  

    // ========================= 

    // CLOSE BUTTON 

    // ========================= 

  

    const closeButton = scene.add.text( 

        startX + monitorWidth / 2 - 40, 

        monitorY - monitorHeight / 2 + 20, 

        "×", 

        { 

            fontSize: "32px", 

            color: "#ffffff" 

        } 

    ); 

  

    closeButton.setInteractive({ 

        useHandCursor: true 

    }); 

  

    monitorObjects.push(closeButton); 

  

  

    // ========================= 

    // SLIDE-IN ANIMATION 

    // ========================= 

  

    scene.tweens.add({ 

        targets: monitorObjects, 

  

        x: "-=" + (startX - endX), 

  

        duration: 600, 

  

        ease: "Power2" 

    }); 

  

  

    // ========================= 

    // RUN CODE → ADD BUILDING 

    // ========================= 

  

    runButton.on("pointerdown", () => { 

  

        scene.add.rectangle( 

            600, 

            450, 

            90, 

            80, 

            0xd98c3f 

        ); 

  

        task.setText( 

            "CURRENT TASK\nCode executed!\nNew building added." 

        ); 

    }); 

  

  

    // ========================= 

    // CLOSE MONITOR 

    // ========================= 

  

    closeButton.on("pointerdown", () => { 

  

        scene.tweens.add({ 

            targets: monitorObjects, 

  

            x: "+=" + (startX - endX), 

  

            duration: 500, 

  

            ease: "Power2", 

  

            onComplete: () => { 

  

                monitorObjects.forEach(object => { 

                    object.destroy(); 

                }); 

  

                scene.monitorOpen = false; 

            } 

        }); 

    }); 

} 