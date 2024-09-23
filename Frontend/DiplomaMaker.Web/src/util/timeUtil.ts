export const delay = (ms: number): Promise<void> =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

export const blendProgress = async (start: number, end: number, blendDelay: number, setProgress: (value: React.SetStateAction<number>) => void) => {
    const steps = Math.abs(end - start);
    const stepDelay = blendDelay / steps;
    for (let i = 1; i <= steps; i++) {
        await delay(stepDelay);
        setProgress(Math.round(start + i * Math.sign(end - start)));
    }
}