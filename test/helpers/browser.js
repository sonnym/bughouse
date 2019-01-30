import browserEnv from "browser-env"
import hooks from "require-extension-hooks"

browserEnv({ pretendToBeVisual: true })

hooks("vue").plugin("vue").push()
hooks(["vue", "js"]).exclude(/webpack\.config\.js/).plugin("babel").push()
