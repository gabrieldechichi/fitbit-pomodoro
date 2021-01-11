export class CSSUtils {
    static replaceClass(classes: string, classToReplace: string, replaceFor: string): string {
        return classes.replace(classToReplace, replaceFor)
    }

    static replaceElementClass(el: Element, classToReplace: string, replaceFor: string) {
        el.class = CSSUtils.replaceClass(el.class, classToReplace, replaceFor)
    }
}
