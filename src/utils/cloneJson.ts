export const cloneJson = <T extends object>(json: T): T => {
  return JSON.parse(JSON.stringify(json))
}
