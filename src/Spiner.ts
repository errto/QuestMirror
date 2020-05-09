// ウェイトインディケータ
export default class Spinner {

    // HTML要素
    private static element: SVGSVGElement;
    // id 
    private static id: NodeJS.Timeout | null;

    // コンストラクタ
    constructor() {
        Spinner.element = <SVGSVGElement>document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        let c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        Spinner.element.setAttribute('width','100');
        Spinner.element.setAttribute('height','100');
        c.setAttribute('viewBox','0 0 100 100');
        c.setAttribute('cx','50');
        c.setAttribute('cy','50');
        c.setAttribute('r','42');
        c.setAttribute('stroke-width','16');
        c.setAttribute('stroke','#2196f3');
        c.setAttribute('fill','transparent');
        Spinner.element.appendChild(c);
        Spinner.element.style.cssText='position:absolute;left:calc(50% - 50px);top:calc(50% - 50px)';
        document.body.appendChild(Spinner.element);
        Spinner.id = null;
    }

    // 表示する
    public show(): void {
        const c=264,m=15;
        Spinner.element.style.display='block';
        move1();
        function move1(){
            let i=0,o=0;
            move();
            function move(){
                if(i==c)move2();
                else{
                    i+=4;o+=8;
                    Spinner.element.setAttribute('stroke-dasharray',i+' '+(c-i));
                    Spinner.element.setAttribute('stroke-dashoffset',o.toString())
                    Spinner.id = setTimeout(move,m)
                }
            }
        }
        function move2(){
            let i=c,o=c*2;
            move();
            function move(){
                if(i==0)move1();
                else{
                    i-=4;o+=4;
                    Spinner.element.setAttribute('stroke-dasharray',i+' '+(c-i));
                    Spinner.element.setAttribute('stroke-dashoffset',o.toString())
                    Spinner.id = setTimeout(move,m)
                }
            }
        }
    }

    // 非表示にする
    public hide(): void {
        Spinner.element.style.display='none';
        if(Spinner.id){
            clearTimeout(Spinner.id);
            Spinner.id=null
        }
        Spinner.element.setAttribute('stroke-dasharray','0 264');
        Spinner.element.setAttribute('stroke-dashoffset','0')
    }
}