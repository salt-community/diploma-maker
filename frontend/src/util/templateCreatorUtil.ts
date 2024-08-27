export const calculateCanvasSizeFromPdfSize = (size: number) => {
    const averageMultiplier = 0.353;
    const canvasSize = size * averageMultiplier;

    return canvasSize
}