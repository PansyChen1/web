### 一.清除浮动

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
