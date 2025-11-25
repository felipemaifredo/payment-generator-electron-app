import { app, BrowserWindow, ipcMain } from "electron"
import path from "node:path"
import started from "electron-squirrel-startup"
import { db } from "./configs/firebaseConfig"

// Global reference to the main window so IPC handlers can access it
let mainWindow: BrowserWindow | null = null

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1450,
    height: 800,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    )
  }

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Firebase IPC Handlers
  ipcMain.handle("firebase:test-connection", async () => {
    try {
      const collections = await db.listCollections()
      return { success: true, message: `Conectado! Encontradas ${collections.length} coleções.` }
    } catch (error: any) {
      console.error("Firebase connection error:", error)
      return { success: false, message: error.message }
    }
  })

  // Project handlers
  ipcMain.handle("firebase:get-projects", async () => {
    try {
      console.log("Fetching projects from Firebase...")
      const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get()
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log(`Found ${projects.length} projects`)
      return projects
    } catch (error: any) {
      console.error("Error getting projects:", error)
      // If orderBy fails due to missing index, try without ordering
      try {
        console.log("Retrying without orderBy...")
        const snapshot = await db.collection("projects").get()
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        console.log(`Found ${projects.length} projects (unordered)`)
        return projects
      } catch (retryError: any) {
        console.error("Retry also failed:", retryError)
        throw retryError
      }
    }
  })

  ipcMain.handle("firebase:create-project", async (_event, project) => {
    try {
      const docRef = await db.collection("projects").add({
        ...project,
        createdAt: new Date().toISOString()
      })
      const doc = await docRef.get()
      return { id: doc.id, ...doc.data() }
    } catch (error: any) {
      console.error("Error creating project:", error)
      throw error
    }
  })

  ipcMain.handle("firebase:update-project", async (_event, id, updates) => {
    try {
      await db.collection("projects").doc(id).update(updates)
    } catch (error: any) {
      console.error("Error updating project:", error)
      throw error
    }
  })

  ipcMain.handle("firebase:delete-project", async (_event, id) => {
    try {
      // Delete all sprints for this project
      const sprintsSnapshot = await db.collection("sprints").where("projectId", "==", id).get()
      const batch = db.batch()

      // For each sprint, also delete its time entries
      for (const sprintDoc of sprintsSnapshot.docs) {
        const entriesSnapshot = await db.collection("timeEntries").where("sprintId", "==", sprintDoc.id).get()
        entriesSnapshot.docs.forEach(doc => batch.delete(doc.ref))
        batch.delete(sprintDoc.ref)
      }

      await batch.commit()

      // Then delete the project
      await db.collection("projects").doc(id).delete()
    } catch (error: any) {
      console.error("Error deleting project:", error)
      throw error
    }
  })

  // Sprint handlers
  ipcMain.handle("firebase:get-sprints", async (_event, projectId) => {
    try {
      console.log(`Fetching sprints for project ${projectId} from Firebase...`)
      const snapshot = await db.collection("sprints")
        .where("projectId", "==", projectId)
        .orderBy("createdAt", "desc")
        .get()
      const sprints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log(`Found ${sprints.length} sprints`)
      return sprints
    } catch (error: any) {
      console.error("Error getting sprints:", error)
      // If orderBy fails due to missing index, try without ordering
      try {
        console.log("Retrying without orderBy...")
        const snapshot = await db.collection("sprints")
          .where("projectId", "==", projectId)
          .get()
        const sprints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        console.log(`Found ${sprints.length} sprints (unordered)`)
        return sprints
      } catch (retryError: any) {
        console.error("Retry also failed:", retryError)
        throw retryError
      }
    }
  })


  ipcMain.handle("firebase:create-sprint", async (_event, sprint) => {
    try {
      const docRef = await db.collection("sprints").add({
        ...sprint,
        createdAt: new Date().toISOString()
      })
      const doc = await docRef.get()
      return { id: doc.id, ...doc.data() }
    } catch (error: any) {
      console.error("Error creating sprint:", error)
      throw error
    }
  })

  ipcMain.handle("firebase:update-sprint", async (_event, id, updates) => {
    try {
      await db.collection("sprints").doc(id).update(updates)
    } catch (error: any) {
      console.error("Error updating sprint:", error)
      throw error
    }
  })

  ipcMain.handle("firebase:delete-sprint", async (_event, id) => {
    try {
      // Delete all time entries for this sprint first
      const entriesSnapshot = await db.collection("timeEntries").where("sprintId", "==", id).get()
      const batch = db.batch()
      entriesSnapshot.docs.forEach(doc => batch.delete(doc.ref))
      await batch.commit()

      // Then delete the sprint
      await db.collection("sprints").doc(id).delete()
    } catch (error: any) {
      console.error("Error deleting sprint:", error)
      throw error
    }
  })

  // Time entry handlers
  ipcMain.handle("firebase:get-time-entries", async (_event, sprintId) => {
    try {
      const snapshot = await db.collection("timeEntries")
        .where("sprintId", "==", sprintId)
        .orderBy("createdAt", "desc")
        .get()
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error: any) {
      console.error("Error getting time entries:", error)
      throw error
    }
  })

  ipcMain.handle("firebase:create-time-entry", async (_event, entry) => {
    try {
      const docRef = await db.collection("timeEntries").add({
        ...entry,
        createdAt: new Date().toISOString()
      })
      const doc = await docRef.get()
      return { id: doc.id, ...doc.data() }
    } catch (error: any) {
      console.error("Error creating time entry:", error)
      throw error
    }
  })

  ipcMain.handle("firebase:delete-time-entry", async (_event, id) => {
    try {
      await db.collection("timeEntries").doc(id).delete()
    } catch (error: any) {
      console.error("Error deleting time entry:", error)
      throw error
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

ipcMain.on("minimize-window", () => {
  if (mainWindow) {
    mainWindow.minimize()
  }
})

ipcMain.on("maximize-window", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})

ipcMain.on("close-window", () => {
  if (mainWindow) {
    mainWindow.close()
  }
})

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and import them here.
