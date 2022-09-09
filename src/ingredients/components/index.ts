const modules = import.meta.globEager("./*.ts");

const Components: DomItem[] = [];
for (let m in modules) {
  Components.push(modules[m].default);
}

export default Components;
