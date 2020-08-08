
//
// Webpack Interop
//

declare module '*.less' {
    const _: { [key: string]: string }
    export default _
}

declare module '*.png' {
    const _: string
    export default _
}
