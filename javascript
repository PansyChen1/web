javascript知识点

#ES6
##面试题
问题:
    1.es6模块化如何使用，开发环境如何打包?
    2.class 和普通构造函数有什么区别?
    3.promise 的基本使用和原理?
    4.总结es6的其他功能?
解答:
    1.babel (只能编译es6语法，不能解决模块化问题)
	   1)npm install --save-dev babel-core babel-preset-es2015 babel-preset-latest
	   2)创建.babelrc文件
	   3)npm install -g babel-cli
	   4)创建./srcindex.js并编辑内容
	   5)babel ./src/index.js
	  webpack解决模块化问题
	   1)npm install webpack babel-loader --save-dev
	   2)配置webpack.config.js
	   3)配置package.json中的scripts("start":webpack)
	   4)运行npm start
                                         			
##Module的语法
export 可输出变量、函数和(class)
//方式一:
export var name='yao';
export function v1(){}
//方式二:
var name='yao';
export{name};
//方式三:
function v1(){};
export {v1 as v11};
//方式四:指定模块的默认输出
export default {a:100}
export default function (){}//匿名函数
function foo(){};//非匿名函数
export default foo;
import 加载模块
//方式一:
import {name} from 'xxx';
//方式二:
import {name as name1} from 'xxx';
//import 'lodash';仅仅执行lodash,但是并没有输入任何值
//方式三:模块的整体加载(两个方法)
import *as circle from 'xxx';
circle.area();
circle.circumference();
//方式四:
import myClass from 'xxx';//export default class{};
