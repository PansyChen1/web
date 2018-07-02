一.清除浮动
（1）问题的由来
有这样一种情形：在一个容器（container）中，有两个浮动的子元素。
<div>
     <div style="float:left;width:45%;"></div>
     <div style="float:right;width:45%;"></div>
</div>
在浏览器中一运行，就会出现意想不到的结果。实际视图是子元素显示在父容器的外部。
（2）问题的原因与浮动定位有关。
在CSS规范中，浮动定位不属于正常的页面流（page flow），是独立定位的。所以，只含有浮动元素的父容器，在显示时不考虑子元素的位置，就当它们不存在一样。
这就造成了显示出来，父容器好像空容器一样。
（3）清除浮动的方法

方法一：添加空元素
经典的解决方法，就是在浮动元素下方添加一个非浮动元素。
代码这样写：
<div>
    <div style="float:left;width:45%;"></div>
    <div style="float:right;width:45%;"></div>
    <div style="clear:both;"></div>
</div>
原理是父容器现在必须考虑非浮动子元素的位置，而后者肯定出现在浮动元素下方，所以显示出来，父容器就把所有子元素都包括进去了。这种方法比较简单，
但是要在页面中增加冗余标签，违背了语义网的原则。

方法二：浮动的父容器
另一种思路是，索性将父容器也改成浮动定位，这样它就可以带着子元素一起浮动了。
<div style="float:left;">
   <div style="float:left;width:45%;"></div>
   <div style="float:right;width:45%;"></div>
</div>
这种方法不用修改HTML代码，但是缺点在于父容器变成浮动以后，会影响到后面元素的定位，而且有时候，父容器是定位死的，无法变成浮动。

方法三：浮动元素的自动clearing
让父容器变得可以自动"清理"（clearing）子元素的浮动，从而能够识别出浮动子元素的位置，不会出现显示上的差错。
要做到这点，只要为父容器加上一条"overflow: hidden"的CSS语句就行了。关于为何父容器可以自动识别：由于加上overflow:hidden之后要计算超出的大小来隐藏，
所以父容器会自动撑开自己把所有的子元素放进去，同时会计算浮动的子元素。
代码这样写：
<div style="overflow: hidden;">
   <div style="float:left;width:45%;"></div>
   <div style="float:right;width:45%;"></div>
</div>
这种方法的缺点主要有二个，一个是IE 6不支持，另一个是一旦子元素的大小超过父容器的大小，就会出显示问题。

方法四：能不能通过CSS语句添加子元素呢，这样就不用修改HTML代码了？
回答是可以的，我们知道CSS语句中有一个:after伪选择符，就可以在父容器的尾部自动创建一个子元素，这正好符合我们的需要。
下面的代码参照了lifesinger的写法：
.clearfix:after {
content: "\0020";
display: block;
height: 0;
clear: both;
}
"clearfix"是父容器的class名称，"content:"020";"是在父容器的结尾处放一个空白字符，"height: 0;"是让这个这个空白字符不显示出来，"display: block; 
clear: both;"是确保这个空白字符是非浮动的独立区块。
但是，:after选择符IE 6不支持，也就是说上面的这段代码在IE 6中无效，这怎么办？
我们添加一条IE 6的独有命令"zoom:1;"就行了，这条命令的作用是激活父元素的"hasLayout"属性，让父元素拥有自己的布局。IE 6会读取这条命令，其他浏览器则
会直接忽略它。
最终代码（常用这种方法）
.clearfix:after {
content: "";
display: block;
clear: both;
}
.clearfix {
zoom: 1;
}
二,z-index无效

在CSS中，只能通过代码改变层级，这个属性就是z- index，要让z-index起作用的前提，就是元素的position属性要是relative，absolute或是fixed。
1.第一种情况（z-index无论设置多高都不起作用情况）：
这种情况发生的条件有三个：
1、父标签 position属性为relative；
2、问题标签无position属性（不包括static）；
3、问题标签含有浮动(float)属性。
eg:z-index层级不起作用，浮动会让z-index失效，代码如下:
1	<</code>DIV style="POSITION: relative; Z-INDEX: 9999"> 
2	<</code>IMG style="FLOAT: left" src="http://www.yuanchuang.net/uploads/allimg/131101/1A5494I0-0.jpg"> 
3	</</code>DIV>
解决办法有三个（任一即可）：

1、position:relative改为position:absolute；
2、浮动元素添加position属性（如relative，absolute等）；
3、去除浮动。

2.第二种情况

IE6下，层级的表现有时候不是看子标签的z-index多高，而要看整个DOM tree（节点树）的第一个relative属性的父标签的层级。

eg:IE7与IE6有着同样的bug，原因很简单，虽然图片所在div当前的老爸层级很高(1000)，但是由于老爸的老爸不顶用，可怜了9999如此强势的孩子没有出头之日啊！，代码如下:

1	<</code>DIV style="POSITION: relative"> 
2	<</code>DIV style="POSITION: relative; Z-INDEX: 1000"> 
3	<</code>DIV style="POSITION: absolute; Z-INDEX: 9999"> <</code>IMG src="http://www.yuanchuang.net/uploads/allimg/131101/1A3194V7-1.jpg"> </</code>DIV> 
4	</</code>DIV> 
5	</</code>DIV>
解决办法： 在第一个relative属性加上一个更高的层级（z-index:1），代码如下:

1	<</code>DIV style="POSITION: relative; Z-INDEX: 1"> 
2	<</code>DIV style="POSITION: relative; Z-INDEX: 1000"> 
3	<</code>DIV style="POSITION: absolute; Z-INDEX: 9999"> <</code>IMG src="http://www.yuanchuang.net/uploads/allimg/131101/1A3194V7-1.jpg"> </</code>DIV> 
4	</</code>DIV> 
5	</</code>DIV>

三、:after,:before
定义和用法
:after 选择器在被选元素的内容后面插入内容。
请使用 content 属性来指定要插入的内容。
在P标签内容后面加上"台词"
p:after
{ 
content:"台词：";
}
：before用法类似。

四、利用@media screen实现网页布局的自适应

优点:无需插件和手机主题,对移动设备友好,能够适应各种窗口大小。只需在CSS中添加@media screen属性,根据浏览器宽度判断并输出不同的长宽值

1280分辨率以上（大于1200px）

@media screen and (min-width:1200px){
    #page{ width: 1100px; }#content,.div1{width: 730px;}#secondary{width:310px}
}
 
1100分辨率（大于960px，小于1199px）

@media screen and (min-width: 960px) and (max-width: 1199px) {
    #page{ width: 960px; }#content,.div1{width: 650px;}#secondary{width:250px}select{max-width:200px}
}
 
880分辨率（大于768px，小于959px）

@media screen and (min-width: 768px) and (max-width: 959px) {
    #page{ width: 900px; }#content,.div1{width: 620px;}#secondary{width:220px}select{max-width:180px}
}
 
720分辨率（大于480px，小于767px）

@media only screen and (min-width: 480px) and (max-width: 767px){
    #page{ width: 450px; }#content,.div1{width: 420px;position: relative; }#secondary{display:none}#access{width: 450px; }#access a {padding-right:5px}#access a img{display:none}#rss{display:none}#branding #s{display:none}
}
 
440分辨率以下（小于479px）

@media only screen and (max-width: 479px) {
    #page{ width: 300px; }#content,.div1{width: 300px;}#secondary{display:none}#access{width: 330px;} #access a {padding-right:10px;padding-left:10px}#access a img{display:none}#rss{display:none}#branding #s{display:none}#access ul ul a{width:100px}
} 
                                           
                                           
  # 面试题                                                  
  ### 1.介绍一下标准的CSS的盒子模型？与低版本IE的盒子模型有什么不同的？
	ie8及以上为w3c标准盒子模型标准盒子模型：宽度=内容的宽度（content）+ border + padding + margin低版本IE盒子模型：宽度=内容宽度（content+border+padding）+ margin
### 2. box-sizing属性？
	用来控制元素的盒子模型的解析模式，默认为content-box,context-box：W3C的标准盒子模型，设置元素的 height/width 属性指的是content部分的高/宽,border-box：IE传统盒子模型。设置元素的height/width属性指的是border + padding + content部分的高/宽
### 3.CSS选择器有哪些？哪些属性可以继承？
	元素选择器：通配符(*)不兼容ie6;
           id选择符(E#id);
           类选择符(E.class)ie6不支持多类选择;
	   E(类型选择符，即标签名)
	关系选择器：包含选择符(E F);
           子选择符(E>F)不兼容ie6;
	   相邻选择符(E+F)不兼容ie6;     
           兄弟选择符(E~F)不兼容ie6;
           <style> 
		 /* 相邻选择符(E+F) */ 
		 p+p{color:#f00;}
		 /* 兄弟选择符(E~F) */
		 p~p{color:#f00;} 
	   </style>
           <p>p1</p> 
	   <p>p2</p> 
	   <h3>这是一个标题</h3>
	   <p>p3</p>
	   <h3>这是一个标题</h3>
	   <p>p4</p> 
	   <p>p5</p>,
	   此例，如果使用p + p{color:#f00;}，那么p2, p5将会变成红色；如果使用p ~ p{color:#f00;}，那么p2,p3,p4,p5将会变成红色；
										
	属性选择器：E[att],选择具有att属性的E元素,不兼容ie6
           E[att="val"],选择具有att属性且属性值等于val的E元素,不兼容ie6			
	   E[att~="val"],选择具有att属性且属性值为一用空格分隔的字词列表,其中一个等于val的E元素(包含只有一个值且该值等于val的情况)不兼容ie6
	   E[att^="val"],选择具有att属性且属性值为以val开头的字符串的E元素,不兼容ie6
	   E[att$="val"],选择具有att属性且属性值为以val结尾的字符串的E元素,不兼容ie6
	   E[att*="val"],选择具有att属性且属性值为包含val的字符串的E元素,不兼容ie6
	   E[att|="val"],选择具有att属性且属性值为以val开头并用连接符"-"分隔的字符串的E元素，如果属性值仅为val，也将被选择
	伪类选择器：
	伪对象选择器：
	可继承的属性:布局(visibility),
            颜色(color,opacity不能继承),
            字体(font,font-style,font-variant,font-weight,font-size, font-family,font-stretch,font-size-adjust), 
            文本(text-transform,white-space,tab-size,word-break,word-wrap,overflow-wrap,text-align,text-align-last,
                 text-justify,word-spacing,text-indent,line-height,letter-spacing,text-size-adjust,文本中的vertical-align没有继承,其他具有),
            文本装饰(text-shadow,text-underline-position,text-decoration-skip),
            书写模式(derection,writing-mode),
            列表(list-style,list-style-image,,list-style-position,list-style-type),
            表格(table-layout,border-collapse,border-spacing,empty-cells),
            内容(quotes),
            用户界面(cursor,zoom,pointer-events),
            Only IE(scrollbar-3dlight-color,scrollbar-darkshadow-color,scrollbar-highlight-color,scrollbar-shadow-color,
                    scrollbar-arrow-color,scrollbar-face-color,scrollbar-track-color,scrollbar-base-color,filter和behavior没有继承),
            Only webkit(text-fill0-color,text-stroke,text-stroke-width,text-stroke-color，tap-highlight-color，user-drag)
	不可继承的样式:border, padding, margin, width, height...
	优先级(就近原则):!important > [ id > class > tag ]
	!important 比内联优先级高

4、 CSS优先级算法如何计算？
选择器的特殊性值表述为4个部分,用0,0,0,0表示。
    ID选择器的特殊性值，加0,1,0,0。
    类选择器、属性选择器或伪类，加0,0,1,0。
    元素和伪元素，加0,0,0,1。
    通配选择器*对特殊性没有贡献，即0,0,0,0。
    style="" 特殊性值为1,0,0,0
    最后比较特殊的一个标志!important（权重），它没有特殊性值，但它的优先级是最高的，为了方便记忆，可以认为它的特殊性值为1,0,0,0,0。
    !important声明的样式优先级最高，如果冲突再进行计算。
    如果优先级相同，则选择最后出现的样式。
    继承得到的样式的优先级最低。

5 、CSS3新增伪类有那些?(CSS伪类是用来添加一些选择器的特殊效果)
    E:not(s) 匹配不含有s选择符的元素E
    E:root   匹配E元素在文档的根元素。在HTML中，根元素永远是HTML
    E:last-child 匹配父元素的最后一个子元素E,要使该属性生效,E元素必须是某个元素的子元素,E的父元素最高是body,即E可以是body的子元素
                 E必须是它的兄弟元素中的最后一个元素,换言之,E必须是父元素的最后一个子元素
    E:only-chird 匹配父元素仅有的一个子元素E,不是
    E:nth-child(n) 匹配父元素的第n个子元素E，假设该子元素不是E，则选择符无效,可以使用odd, even实现奇偶,
                   E:nth-child(n)会选择父元素的第n个子元素E，如果第n个子元素不是E，则是无效选择符，但n会递增
    E:nth-last-child(n) 匹配父元素的倒数第n个子元素E，假设该子元素不是E，则选择符无效
    E:first-of-type 匹配同类型中的第一个同级兄弟元素E,该选择符总是能命中父元素的第1个为E的子元素，不论第1个子元素是否为E
    E:last-of-type 匹配同类型中的最后一个同级兄弟元素E,该选择符总是能命中父元素的倒数第1个为E的子元素，不论倒数第1个子元素是否为E
    E:only-of-type 匹配同类型中的唯一的一个同级兄弟元素E,该选择符总是能命中父元素的唯一同类型子元素E，不论该元素的位置
    E:nth-of-type(n) 匹配同类型中的第n个同级兄弟元素E,该选择符总是能命中父元素的第n个为E的子元素，不论第n个子元素是否为E
    E:nth-last-of-type(n) 匹配同类型中的倒数第n个同级兄弟元素E,该选择符总是能命中父元素的倒数第n个为E的子元素，不论倒数第n个子元素是否为E
    E:empty 匹配没有任何子元素(包括text节点)的元素
    E:checked 匹配用户界面上处于选中状态的元素E(用于input type为radio与checkbox时)
    E:enabled 匹配用户界面上处于可用状态的元素E
    E:disabled 匹配用户界面上处于禁用状态的元素E 
    E:target 匹配相关URL指向的E元素
  
6、如何实现水平居中？如何居中一个浮动元素？如何让绝对定位的div居中？
水平居中的6中实现方式
    1)行内元素
      在父元素实现text-align:center
    2)定宽块状
      div{
          width:960px;
          margin: 0 auto;
      }
      或:
      div{
          position:absolute;
          width:960px;
          left:50%;
          margin-left:-480px; 
      }
      或:
       div{
          position:absolute;
          width:960px;
          left:50%;
          margin-left:-480px; 
      }
      优点:实现方法简单易懂，浏览器兼容性强；
      缺点:扩展性差，无法自适应未知项情况
    3)不定宽块状
      直接把元素改为行内元素,既display:inline-block,然后就可以用text-align:center了
      缺点:子元素之间由回车符带来的空白间距,(而且这个间距并不是所有浏览器都有),所以需要解决下inline-block带来的间距问题
      或:浮动实现水平居中的方法


7 、display有哪些值？说明他们的作用?
inline(默认)--内联
none  
block  
inline-block
list-item  
table  指定对象作为块元素级的表格。类同于html标签<table>(CSS2)
inline-table 指定对象作为内联元素级的表格。类同于html标签<table>(CSS2)
table-caption 指定对象作为表格标题。类同于html标签<caption>(CSS2)
table-cell  指定对象作为表格单元格。类同于html标签<td>(CSS2)
table-row  指定对象作为表格行。类同于html标签<tr>(CSS2)
table-row-group  指定对象作为表格行组。类同于html标签<tbody>(CSS2)
table-column  指定对象作为表格列。类同于html标签<col>(CSS2)
table-column-group  指定对象作为表格列组显示。类同于html标签<colgroup>(CSS2)
table-header-group  指定对象作为表格标题组。类同于html标签<thead>(CSS2)
table-footer-group  指定对象作为表格脚注组。类同于html标签<tfoot>(CSS2)
run-in  根据上下文决定对象是内联对象还是块级对象。(CSS3)
box  将对象作为弹性伸缩盒显示。（伸缩盒最老版本）(CSS3)
inline-box  将对象作为内联块级弹性伸缩盒显示。（伸缩盒最老版本）(CSS3)
flexbox  将对象作为弹性伸缩盒显示。（伸缩盒过渡版本）(CSS3)
inline-flexbox  将对象作为内联块级弹性伸缩盒显示。（伸缩盒过渡版本）(CSS3)
flex  将对象作为弹性伸缩盒显示。（伸缩盒最新版本）(CSS3)
inline-flex  将对象作为内联块级弹性伸缩盒显示。（伸缩盒最新版本）(CSS3)

8、 position的值？
static（默认）：按照正常文档流进行排列；
relative（相对定位）：不脱离文档流，参考自身静态位置通过 top, bottom, left, right 定位；
absolute(绝对定位)：参考距其最近一个不为static的父级元素通过top, bottom, left, right 定位；
fixed(固定定位)：所固定的参照对像是可视窗口。
center  与absolute一致,但偏移定位是以定位祖先元素的中心点为参考 (支持不高)
page 与absolute一致。元素在分页媒体或者区域块内,元素的包含块始终是初始包含块，否则取决于每个absolute模式。(CSS3)支持不高
sticky
9、 CSS3有哪些新特性？
    1)css3的新的选择器
    2)@Font-face 特性
    3)圆角
    4)多列布局
    5)阴影(shadow)
    6)渐变效果
    7)弹性盒子模型
    8)CSS3制作特效(过渡)
    9)媒体查询
➤RGBA和透明度
➤background-image background-origin(content-box/padding-box/border-box) background-size background-repeat
➤word-wrap（对长的不可分割单词换行）word-wrap：break-word
➤文字阴影：text-shadow： 5px 5px 5px #FF0000;（水平阴影，垂直阴影，模糊距离，阴影颜色）
➤font-face属性：定义自己的字体
➤圆角（边框半径）：border-radius 属性用于创建圆角
➤边框图片：border-image: url(border.png) 30 30 round
➤盒阴影：box-shadow: 10px 10px 5px #888888
➤媒体查询：定义两套css，当浏览器的尺寸变化时会采用不同的属性

10、 请解释一下CSS3的flexbox（弹性盒布局模型）,以及适用场景？

该布局模型的目的是提供一种更加高效的方式来对容器中的条目进行布局、对齐和分配空间。在传统的布局方式中，block 布局是把块在垂直方向从上到下依次排列的；

而 inline 布局则是在水平方向来排列。弹性盒布局并没有这样内在的方向限制，可以由开发人员自由操作。

试用场景：弹性布局适合于移动前端开发，在Android和ios上也完美支持。

11 、用纯CSS创建一个三角形的原理是什么？

首先，需要把元素的宽度、高度设为0。然后设置边框样式。

width: 0;
height: 0;

border-top: 40px solid transparent;

border-left: 40px solid transparent;

border-right: 40px solid transparent;

border-bottom: 40px solid #ff0000;

12 、一个满屏品字布局如何设计?

第一种真正的品字：

➤三块高宽是确定的；

➤上面那块用margin: 0 auto;居中；

➤下面两块用float或者inline-block不换行；

➤用margin调整位置使他们居中。

第二种全屏的品字布局:

上面的div设置成100%，下面的div分别宽50%，然后使用float或者inline使其不换行。

13、 常见的兼容性问题？

➤不同浏览器的标签默认的margin和padding不一样。

*{margin:0;padding:0;}

➤IE6双边距bug：块属性标签float后，又有横行的margin情况下，在IE6显示margin比设置的大。hack：display:inline;将其转化为行内属性。

➤渐进识别的方式，从总体中逐渐排除局部。首先，巧妙的使用“9”这一标记，将IE浏览器从所有情况中分离出来。接着，再次使用“+”将IE8和IE7、IE6分离开来，这样IE8已经独立识别。

{background-color:#f1ee18;
/*所有识别*/

.background-color:#00deff9;

/*IE6、7、8识别*/

+background-color:#a200ff;

/*IE6、7识别*/

_background-color:#1e0bd1;

/*IE6识别*/}

➤设置较小高度标签（一般小于10px），在IE6，IE7中高度超出自己设置高度。hack：给超出高度的标签设置overflow:hidden;或者设置行高line-height 小于你设置的高度。

➤IE下，可以使用获取常规属性的方法来获取自定义属性,也可以使用getAttribute()获取自定义属性；Firefox下，只能使用getAttribute()获取自定义属性。解决方法:统一通过getAttribute()获取自定义属性。

➤Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示,可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决。

➤超链接访问过后hover样式就不出现了，被点击访问过的超链接样式不再具有hover和active了。

解决方法是改变CSS属性的排列顺序:L-V-H-A ( love hate ): a:link {} a:visited {} a:hover {} a:active {}

14、 为什么要初始化CSS样式
因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。

15、 absolute的containing block计算方式跟正常流有什么不同？

无论属于哪种，都要先找到其祖先元素中最近的 position 值不为 static 的元素，然后再判断：
➤若此元素为 inline 元素，则 containing block 为能够包含这个元素生成的第一个和最后一个 inline box 的 padding box (除 margin, border 外的区域)
 的最小矩形；
➤否则,则由这个祖先元素的 padding box 构成。
如果都找不到，则为 initial containing block。
补充：
➤static(默认的)/relative：简单说就是它的父元素的内容框（即去掉padding的部分）
➤absolute: 向上找最近的定位为absolute/relative的元素
➤fixed: 它的containing block一律为根元素(html/body)

16、 CSS里的visibility属性有个collapse属性值？在不同浏览器下以后什么区别？
当一个元素的visibility属性被设置成collapse值后，对于一般的元素，它的表现跟hidden是一样的。
➤chrome中，使用collapse值和使用hidden没有区别。
➤firefox，opera和IE，使用collapse值和使用display:none没有什么区别。

17、 display:none与visibility：hidden的区别？

display：none 不显示对应的元素，在文档布局中不再分配空间（回流+重绘）

visibility：hidden 隐藏对应元素，在文档布局中仍保留原来的空间（重绘）

18、 position跟display、overflow、float这些特性相互叠加后会怎么样？

display属性规定元素应该生成的框的类型；position属性规定元素的定位类型；float属性是一种布局方式，定义元素在哪个方向浮动。

类似于优先级机制：position：absolute/fixed优先级最高，有他们在时，float不起作用，display值需要调整。float 或者absolute定位的元素，
只能是块元素或表格。

19、 对BFC规范(块级格式化上下文：block formatting context)的理解？

BFC规定了内部的Block Box如何布局。

定位方案：

➤内部的Box会在垂直方向上一个接一个放置。

➤Box垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box的margin会发生重叠。

➤每个元素的margin box 的左边，与包含块border box的左边相接触。

➤BFC的区域不会与float box重叠。

➤BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。

➤计算BFC的高度时，浮动元素也会参与计算。

满足下列条件之一就可触发BFC

➤根元素，即html

➤float的值不为none（默认）

➤overflow的值不为visible（默认）

➤display的值为inline-block、table-cell、table-caption

➤position的值为absolute或fixed

20、 为什么会出现浮动和什么时候需要清除浮动？清除浮动的方式？

浮动元素碰到包含它的边框或者浮动元素的边框停留。由于浮动元素不在文档流中，所以文档流的块框表现得就像浮动框不存在一样。

浮动元素会漂浮在文档流的块框上。

浮动带来的问题：

➤父元素的高度无法被撑开，影响与父元素同级的元素

➤与浮动元素同级的非浮动元素（内联元素）会跟随其后

➤若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面显示的结构。

清除浮动的方式：

➤父级div定义height

➤最后一个浮动元素后加空div标签 并添加样式clear:both。

➤包含浮动元素的父标签添加样式overflow为hidden或auto。

➤父级div定义zoom

21、 上下margin重合的问题

在重合元素外包裹一层容器，并触发该容器生成一个BFC。

例子：

<div class="aside"></div><div class="text"> <div class="main"></div></div><!--下面是css代码-->
.aside {

margin-bottom: 100px; width: 100px;

height: 150px;

background: #f66; }

.main {

margin-top: 100px;

height: 200px;

background: #fcc; }

.text{

/*盒子main的外面包一个div，

通过改变此div的属性使两个

盒子分属于两个不同的BFC，

以此来阻止margin重叠*/overflow: hidden;

//此时已经触发了BFC属性。}

22、设置元素浮动后，该元素的display值是多少？

自动变成display:block

23 、移动端的布局用过媒体查询吗？

通过媒体查询可以为不同大小和尺寸的媒体定义不同的css，适应相应的设备的显示。

➤<head>里边

<link rel="stylesheet" type="text/css" href="xxx.css" media="only screen and (max-device-width:480px)">

➤CSS : @media only screen and (max-device-width:480px) {/css样式/}

24 、使用 CSS 预处理器吗？

Less sass

25、 CSS优化、提高性能的方法有哪些？

➤避免过度约束

➤避免后代选择符

➤避免链式选择符

➤使用紧凑的语法

➤避免不必要的命名空间

➤避免不必要的重复

➤最好使用表示语义的名字。一个好的类名应该是描述他是什么而不是像什么

➤避免！important，可以选择其他选择器

➤尽可能的精简规则，你可以合并不同类里的重复规则

26 、浏览器是怎样解析CSS选择器的？
CSS选择器的解析是从右向左解析的。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。
若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。
两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的
查找上面。而在 CSS 解析完毕后，需要将解析的结果与 DOM Tree 的内容一起进行分析建立一棵 Render Tree，最终用来进行绘图。在建立 Render Tree 时
（WebKit 中的「Attachment」过程），浏览器就要为每个 DOM Tree 中的元素根据 CSS 的解析结果（Style Rules）来确定生成怎样的Render Tree。

27、 在网页中的应该使用奇数还是偶数的字体？为什么呢？

使用偶数字体。偶数字号相对更容易和 web 设计的其他部分构成比例关系。Windows 自带的点阵宋体（中易宋体）从 Vista 开始只提供 12、14、16 px 这三个大小的
点阵，而 13、15、17 px时用的是小一号的点。（即每个字占的空间大了 1 px，但点阵没变），于是略显稀疏。

28、 margin和padding分别适合什么场景使用？

何时使用margin：

➤需要在border外侧添加空白

➤空白处不需要背景色

➤上下相连的两个盒子之间的空白，需要相互抵消时。

何时使用padding：

➤需要在border内侧添加空白

➤空白处需要背景颜色

➤上下相连的两个盒子的空白，希望为两者之和。

兼容性的问题：在IE5 IE6中，为float的盒子指定margin时，左侧的margin可能会变成两倍的宽度。通过改变padding或者指定盒子的display：inline解决。

29、 元素竖向的百分比设定是相对于容器的高度吗？

当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top ,
 margin-bottom 等，当按百分比设定它们时，依据的也是父容器的宽度，而不是高度。

30、 全屏滚动的原理是什么？用到了CSS的哪些属性？

➤原理：有点类似于轮播，整体的元素一直排列下去，假设有5个需要展示的全屏页面，那么高度是500%，只是展示100%，剩下的可以通过transform进行y轴定位，也可以通过margin-top实现

➤overflow：hidden；transition：all 1000ms ease；

31、 什么是响应式设计？响应式设计的基本原理是什么？如何兼容低版本的IE？

响应式网站设计(Responsive Web design)是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。

基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理。

页面头部必须有meta声明的viewport。

<meta name=’viewport’
content=”width=device-width,

initial-scale=1. maximum-scale=1,

user-scalable=no”>

32、 视差滚动效果？

视差滚动（Parallax Scrolling）通过在网页向下滚动的时候，控制背景的移动速度比前景的移动速度慢来创建出令人惊叹的3D效果。

➤CSS3实现

优点：开发时间短、性能和开发效率比较好，缺点是不能兼容到低版本的浏览器

➤jQuery实现

通过控制不同层滚动速度，计算每一层的时间，控制滚动效果。

优点：能兼容到各个版本的，效果可控性好

缺点：开发起来对制作者要求高

➤插件实现方式

例如：parallax-scrolling，兼容性十分好

33、 ::before 和 :after中双冒号和单冒号有什么区别？解释一下这2个伪元素的作用

➤单冒号(:)用于CSS3伪类，双冒号(::)用于CSS3伪元素。

➤::before就是以一个子元素的存在，定义在元素主体内容之前的一个伪元素。并不存在于dom之中，只存在在页面之中。

:before 和 :after 这两个伪元素，是在CSS2.1里新出现的。起初，伪元素的前缀使用的是单冒号语法，但随着Web的进化，在CSS3的规范里，伪元素的语法被修改成使用双冒号，成为::before ::after

34 、你对line-height是如何理解的？

行高是指一行文字的高度，具体说是两行文字间基线的距离。CSS中起高度作用的是height和line-height，没有定义height属性，最终其表现作用一定是line-height。

单行文本垂直居中：把line-height值设置为height一样大小的值可以实现单行文字的垂直居中，其实也可以把height删除。

多行文本垂直居中：需要设置display属性为inline-block。

35 、怎么让Chrome支持小于12px 的文字？

p{
font-size:10px;

-webkit-transform:scale(0.8);

}

//0.8是缩放比例

36、让页面里的字体变清晰，变细用CSS怎么做？

-webkit-font-smoothing在window系统下没有起作用，但是在IOS设备上起作用-webkit-font-smoothing：antialiased是最佳的，灰度平滑。

37、position:fixed;在android下无效怎么处理？

<meta name="viewport"
content="width=device-width,

initial-scale=1.0,

maximum-scale=1.0,

minimum-scale=1.0,

user-scalable=no"/>

38、如果需要手动写动画，你认为最小时间间隔是多久，为什么？

多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为1/60＊1000ms ＝ 16.7ms。

39、 li与li之间有看不见的空白间隔是什么原因引起的？有什么解决办法？

行框的排列会受到中间空白（回车空格）等的影响，因为空格也属于字符,这些空白也会被应用样式，占据空间，所以会有间隔，把字符大小设为0，就没有空格了。

解决方法：

➤可以将<li>代码全部写在一排

➤浮动li中float：left

➤在ul中用font-size：0（谷歌不支持）；可以使用letter-space：-3px

40、 display:inline-block 什么时候会显示间隙？

➤有空格时候会有间隙 解决：移除空格

➤margin正值的时候 解决：margin使用负值

➤使用font-size时候 解决：font-size:0、letter-spacing、word-spacing

41、 有一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度

外层div使用position：relative；高度要求自适应的div使用position: absolute; top: 100px; bottom: 0; left: 0

42、 png、jpg、gif 这些图片格式解释一下，分别什么时候用。有没有了解过webp？

➤png是便携式网络图片（Portable Network Graphics）是一种无损数据压缩位图文件格式.优点是：压缩比高，色彩好。 大多数地方都可以用。

➤jpg是一种针对相片使用的一种失真压缩方法，是一种破坏性的压缩，在色调及颜色平滑变化做的不错。在www上，被用来储存和传输照片的格式。

➤gif是一种位图文件格式，以8位色重现真色彩的图像。可以实现动画效果.

➤webp格式是谷歌在2010年推出的图片格式，压缩率只有jpg的2/3，大小比png小了45%。缺点是压缩的时间更久了，兼容性不好，目前谷歌和opera支持。

43、 style标签写在body后与body前有什么区别？

页面加载自上而下 当然是先加载样式。

写在body标签后由于浏览器以逐行方式对HTML文档进行解析，当解析到写在尾部的样式表（外联或写在style标签）会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在windows的IE下可能会出现FOUC现象（即样式失效导致的页面闪烁问题）

44 、CSS属性overflow属性定义溢出元素内容区的内容会如何处理?

参数是scroll时候，必会出现滚动条。

参数是auto时候，子元素内容大于父元素时出现滚动条。

参数是visible时候，溢出的内容出现在父元素之外。

参数是hidden时候，溢出隐藏。

45 、阐述一下CSS Sprites

将一个页面涉及到的所有图片都包含到一张大图中去,然后利用CSS的 background-image,background- repeat,background-position 的组合进行背景定位。
利用CSS Sprites能很好地减少网页的http请求，从而大大的提高页面的性能；CSS Sprites能减少图片的字节。