enum FontType {
    regular = 0,
    italic = 1,
    bold = 2
}

export type UserFontResponse = {
    name: string,
    fontType: FontType
}

export type UserFontRequest = UserFontResponse & {
    file: unknown
}

export type UserFontsResponse = {
    userFonts: UserFontResponse[]
}