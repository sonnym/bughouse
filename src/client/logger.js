import { environment } from "./../share/environment"

export default function(message) {
  if (environment === "development") {
    console.log(message)
  } else {
    return
  }
}

export const __useDefault = true
