// const modules = import.meta.globEager("./*.ts");

// const Layouts: DomItem[] = [];
// for (let m in modules) {
//   Layouts.push(modules[m].default);
// }
// export default Layouts;
import BaseBox from "./BaseBox";
import LeftBox from "./LeftBox";
import RightBox from "./RightBox";
import FixedBox from "./FixedBox";
import CeilingBox from "./CeilingBox";
import PageTpl1 from "./PageTpl1";
import PageTpl2 from "./PageTpl2";

export default [BaseBox,LeftBox,RightBox,FixedBox,CeilingBox,PageTpl1,PageTpl2];
