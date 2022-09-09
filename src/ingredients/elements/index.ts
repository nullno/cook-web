const modules = import.meta.globEager("./*.ts");

const Elements: DomItem[] = [];
for (let m in modules) {
  Elements.push(modules[m].default);
}

export default Elements;
