import { TrackResponse } from "./types";

export const generateVerificationCode = (tracks: TrackResponse[]): string => {
    const guid = URL.createObjectURL(new Blob()).slice(-36).replace(/-/g, '')
    const chars = guid.split('');
    const random = () => Math.floor(Math.random() * chars.length);

    while (true) {
        let code = '';
        for (let i = 0; i < 5; i++) {
        code += chars[random()];
        }

        let codeExists = false;

        tracks.forEach(track => {
        track.bootcamps.forEach(bootcamp => {
            bootcamp.students.forEach(student => {
            if (student.verificationCode === code) {
                codeExists = true; 
            }
            });
        });
        });

        if (!codeExists) {
        return code;
        }
    }
};