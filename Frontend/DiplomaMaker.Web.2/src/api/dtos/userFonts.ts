export type UserFontResponse = {
    name: string,
    fontType: "regular" | "italic" | "bold",
}

export type UserFontRequest = UserFontResponse & {
    file: unknown
}

export type UserFontsResponse = {
    userFonts: UserFontResponse[]
}

