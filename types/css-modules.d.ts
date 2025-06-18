// types/css-modules.d.ts (프로젝트 루트에 생성)
declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
  
  declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
  }
  
  declare module '*.module.sass' {
    const classes: { [key: string]: string };
    export default classes;
  }