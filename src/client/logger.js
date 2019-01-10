import { isDevelopment } from "./../share/environment"

export default function(message) {
  if (isDevelopment()) {
    console.log(message)
  }
}

export const __useDefault = true
