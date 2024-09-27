export const setFieldEventListeners = (handleFieldClick: (event: any) => void, handleFieldClickOutside: (event: any) => void) => {
    const selectors = [
        '.pdfpreview div div div div div[title="header"]',
        '.pdfpreview div div div div div[title="main"]',
        '.pdfpreview div div div div div[title="footer"]',
        '.pdfpreview div div div div div[title="link"]',
    ];

    const attachListeners = () => {
        selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            element.removeEventListener('click', handleFieldClick);
            element.addEventListener('click', handleFieldClick);
        });
        });
    };

    const handleClickOutside = (event: MouseEvent) => {
        const isClickInside = selectors.some((selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).some((element) => element.contains(event.target as Node));
        });

        if (!isClickInside) {
        handleFieldClickOutside(event);
        }
    };

    const observer = new MutationObserver(() => {
        attachListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    attachListeners();

    document.addEventListener('click', handleClickOutside);

    return () => {
        observer.disconnect();
        document.removeEventListener('click', handleClickOutside);
        selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            element.removeEventListener('click', handleFieldClick);
        });
        });
    };
};