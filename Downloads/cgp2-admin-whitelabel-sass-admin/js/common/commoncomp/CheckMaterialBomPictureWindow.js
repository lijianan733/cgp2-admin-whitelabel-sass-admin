/**
 * Created by nan on 2019/7/25.
 * 查看结构简图的窗口,
 * 注意，要指定加载其处理文件SaveSvgAsPng.js,因为该文件没Ext的标准命名方式define,故只能用<script>便签引入
 */
Ext.Loader.loadScript(path + 'js/common/controller/SaveSvgAsPng.js');//现在使用了这个方式加载js
Ext.define('CGP.common.commoncomp.CheckMaterialBomPictureWindow', {
    extend: 'Ext.window.Window',
    itemId: 'svg',
    constrain: true,
    modal: true,
    maximizable: true,
    materialId: null,
    layout: 'fit',
    minWidth: 350,
    minHeight: 250,
    imgSeverUrl: null,//请求该图片的url,必须的参数
    autoScroll: true,
    svgData: null,//原始的接口数据
    errorMsg: null,
    config: {
        //这里的属性会自动生成get,set方法
        src: null, //需要展示的图片地址
        clickX: null,//存放鼠标按下时指针X的位置
        clickY: null,//存放鼠标按下时指针Y的位置
        isMoving: false,//一个标识 作为判断当前鼠标是否按下状态 即图片拖拽中状态
        offset: 1.1//放大倍数 默认1.2倍 与原图放大缩小
    },
    tbar: [
        {
            xtype: 'button',
            text: i18n.getKey('download') + 'PNG',
            iconCls: 'icon_export',
            handler: function (btn) {
                var title = 'PNG结构图';
                var svg = document.getElementsByTagName('svg')[0];
                window.saveSvgAsPng(svg, title);
            }
        },
        {
            xtype: 'button',
            text: i18n.getKey('download') + 'SVG',
            iconCls: 'icon_export',
            handler: function (btn) {
                var title = 'SVG结构图';
                var svg = document.getElementsByTagName('svg')[0];
                window.saveSvg(svg, title);
            }
        }
    ],
    bbar: [
        {
            flex: 1,
            xtype: 'slider',
            value: 50,
            clickToChange: true,
            vertical: false,
            minValue: 1,
            maxValue: 100,
            decimalPrecision: 8,
            listeners: {
                afterrender: function (slider) {
                    var panel = slider.ownerCt.ownerCt;
                    slider.relayEvents(panel, ['mousewheelChangeSize']);
                },
                /**
                 * 滚轮调整大小后调整滚动条位置
                 * @param arg
                 */
                mousewheelChangeSize: function (arg) {
                    var slider = this;
                    var image = slider.ownerCt.ownerCt.getComponent('image');
                    var svgEl = image.el.dom.getElementsByTagName('svg')[0];
                    var svgDiv = svgEl.parentNode;
                    var componentDiv = svgDiv.parentNode;
                    if (arg.type) {
                        slider.setValue(slider.getValue() + 1);
                    } else {
                        slider.setValue(slider.getValue() - 1);
                    }
                    componentDiv.scrollTop = arg.oldScrollTop * (svgDiv.children[0].height.animVal.value / arg.oldHeight);
                    componentDiv.scrollLeft = arg.oldScrollLeft * (svgDiv.children[0].width.animVal.value / arg.oldWidth);
                    console.log(componentDiv.scrollLeft + ',' + componentDiv.scrollTop);
                },
                change: function (slider, newValue, oldValue) {
                    var image = slider.ownerCt.ownerCt.getComponent('image');
                    var svgEl = image.el.dom.getElementsByTagName('svg')[0];
                    var svgDiv = svgEl.parentNode;
                    var componentDiv = svgDiv.parentNode;
                    var changedWidth = image.initWidth * (newValue / 50);
                    var changedHeight = image.initHeight * (newValue / 50);
                    console.log(changedWidth, changedHeight);
                    svgEl.setAttribute('width', changedWidth);
                    svgEl.setAttribute('height', changedHeight);
                    svgDiv.style.width = svgEl.width.baseVal.value + 'px';
                    svgDiv.style.height = svgEl.height.baseVal.value + 'px';
                    if (changedWidth > componentDiv.offsetWidth || changedHeight > componentDiv.offsetHeight) {
                        svgDiv.style.transform = 'translate(0%, 0%)';
                        if (changedWidth < componentDiv.offsetWidth) {//处理宽小于于容器
                            svgDiv.style.left = (componentDiv.offsetWidth - changedWidth) / 2 + 'px';
                        } else {
                            svgDiv.style.left = '0px';
                        }
                        if (changedHeight < componentDiv.offsetHeight) {//处理长小于容器
                            svgDiv.style.top = (componentDiv.offsetHeight - changedHeight) / 2 + 'px';
                        } else {
                            svgDiv.style.top = '0px';
                        }
                    } else {
                        svgDiv.style.transform = 'translate(-50%,-50%)';
                        if (changedWidth < componentDiv.offsetWidth) {//处理宽小于于容器
                            svgDiv.style.left = '50%';
                        } else {
                            svgDiv.style.left = '0px';
                        }
                        if (changedHeight < componentDiv.offsetHeight) {
                            svgDiv.style.top = '50%';
                        } else {
                            svgDiv.style.top = '0px';
                        }
                    }
                }
            }
        }
    ],
    initComponent: function () {
        var me = this;
        var imageData = me.getImage();
        var componentData = null;
        if (imageData == false) {
            me.on('show', function () {
                Ext.Msg.alert(i18n.getKey('requestFailed'), me.errorMsg);
            });
        } else {
            componentData = me.builderImageComponent(imageData);
            me.items = [
                {
                    xtype: 'component',
                    itemId: 'image',
                    autoScroll: true,
                    width: 1200,
                    height: 500,
                    html: componentData,
                    style: {
                        backgroundColor: 'darkgrey',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)'
                    },
                    initWidth: null,
                    initHeight: null,
                    onAfterRender: function (img, eOpts) {
                        var win = img.up('window');
                        var lastEventX = 0;
                        var lastEventY = 0;
                        Ext.get(img.getId()).on({  //获得Ext.dom.Element 添加事件 这个区别于原生的element元素 这里是ExtJs自己包装的element元素
                            'mousewheel': {   //监听鼠标滚轮事件(火狐浏览器叫DOMMouseClick)，extjs增加监听事件前面没有on区别于普通js，他是on('事件名':{...})
                                fn: function (e) {
                                    e.preventDefault();
                                    var type = e.getWheelDelta();
                                    win.zoom(img, win.getOffset(), type > 0 ? true : false, win, e.getX(), e.getY())
                                }
                            },
                            'mousemove': {
                                fn: function (e) {
                                    if (win.getIsMoving()) {
                                        var left = 0;
                                        var top = 0;
                                        if (lastEventX != 0) {
                                            left = e.getX() - lastEventX;//y偏移量
                                        }
                                        if (lastEventY != 0) {
                                            top = e.getY() - lastEventY;//y偏移量
                                        }
                                        /* img.el.dom.children[0].style.top = (img.el.dom.children[0].offsetTop + top) + 'px';
                                         img.el.dom.children[0].style.left = (img.el.dom.children[0].offsetLeft + left) + 'px';*/
                                        img.el.dom.scrollTop -= top;
                                        img.el.dom.scrollLeft -= left;
                                        lastEventX = e.getX();
                                        lastEventY = e.getY();
                                    }
                                }
                            },

                            'mouseup': {
                                fn: function (e) {
                                    document.getElementById(img.getId()).style.cursor = "default";
                                    if (win.getIsMoving()) {
                                        win.setClickX(null);
                                        win.setClickY(null);
                                        lastEventX = 0;
                                        lastEventY = 0;
                                        win.setIsMoving(false);
                                    }
                                }
                            },
                            'mousedown': {
                                fn: function (e) {
                                    document.getElementById(img.getId()).style.cursor = "move";
                                    e.stopEvent();
                                    win.setClickX(e.getX());
                                    win.setClickY(e.getY());
                                    win.setIsMoving(true);
                                }
                            }
                        });
                    }
                }
            ];
            me.addEvents('mousewheelChangeSize');//滚轮缩放,改变大小后
        }
        me.callParent();
    },
    /**
     * 获取图片数据
     * @returns {null}
     */
    getImage: function () {
        var me = this;
        var data = null;
        Ext.Ajax.request({
            url: me.imgSeverUrl,
            method: 'POST',
            async: false,
            jsonData: Ext.isEmpty(me.jsonData) ? {} : me.jsonData,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                me.svgData = response.responseText;
                data = response.responseText;
                try {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success == false) {
                        data = false;
                        me.errorMsg = responseMessage.data.message;
                    }
                } catch (e) {
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                data = false;
            }
        });
        return data;
    },
    /**
     * 封装成特定的组件配置
     */
    builderImageComponent: function (imageData) {
        var me = this;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(imageData, 'image/svg+xml');
        var maxHeight = 500;
        //调整svg的宽高
        //给图片对象写入base64编码的svg流
        var SVG = xmlDoc.getElementsByTagName('svg')[0];
        var SVGHeight = SVG.height.baseVal.value;
        var SVGWidth = SVG.width.baseVal.value;
        if (SVGHeight > maxHeight) {
            //转换为高度500的图片
            var width = 500 / SVGHeight * SVGWidth;
            SVGHeight = 500;
            SVGWidth = width;
            SVG.setAttribute('height', 500);
            SVG.setAttribute('width', width);
        }
        //createElement()返回一个Element对象

        me.initHeight = SVGHeight;
        me.initWidth = SVGWidth;

        var tmpNode = document.createElement("div");
        tmpNode.appendChild(SVG.cloneNode(true));
        var SVGStr = tmpNode.innerHTML;


        var data = '<div  id="svgOutDiv" ' +
            'style="background-color:darkgrey;position: absolute;top: 50%;left:55%;transform: translate(-50%,-50%);">'
            + SVGStr + '</div>';
        return data;
    },
    /**
     * 图片放大缩小
     * el:图片dom对象
     * offset:放大缩小的倍数
     * type: true/false 放大缩小的标识
     * panel: 图片外面的paneldow(标定scroll用) x:鼠标x坐标 y:鼠标y坐标
     **/
    zoom: function (img, offset, type, panel, x, y) {
        var panel = this;
        var svgEl = img.el.dom.getElementsByTagName('svg')[0];
        var svgDiv = svgEl.parentNode;
        var componentDiv = svgDiv.parentNode;
        var width = (svgEl.width.animVal.value);
        var height = (svgEl.height.animVal.value);
        var oldHeight = svgDiv.offsetHeight;
        var oldWidth = svgDiv.offsetWidth;
        var oldScrollTop = componentDiv.scrollTop;
        var oldScrollLeft = componentDiv.scrollLeft;
        console.log(new Date(), x, y);
        if (type) {
            var changedWidth = (width * panel.getOffset());
            var changedHeight = (height * panel.getOffset());

        } else {
            var changedWidth = (width / panel.getOffset());
            var changedHeight = (height / panel.getOffset());
        }
        svgDiv.style.width = changedWidth + 'px';
        svgDiv.style.height = changedHeight + 'px';
        svgEl.setAttribute('width', changedWidth);
        svgEl.setAttribute('height', changedHeight);
        if (changedWidth > componentDiv.offsetWidth || changedHeight > componentDiv.offsetHeight) {
            svgDiv.style.transform = 'translate(0%, 0%)';
            if (changedWidth < componentDiv.offsetWidth) {//处理宽小于于容器
                svgDiv.style.left = (componentDiv.offsetWidth - changedWidth) / 2 + 'px';
            } else {
                svgDiv.style.left = '0%';
            }
            if (changedHeight < componentDiv.offsetHeight) {//处理长小于容器
                svgDiv.style.top = (componentDiv.offsetHeight - changedHeight) / 2 + 'px';
            } else {
                svgDiv.style.top = '0%';
            }
        } else {
            svgDiv.style.transform = 'translate(-50%,-50%)';
            if (changedWidth < componentDiv.offsetWidth) {//处理宽小于于容器
                svgDiv.style.left = '50%';
            } else {
                svgDiv.style.left = '0px';
            }
            if (changedHeight < componentDiv.offsetHeight) {//处理长小于容器
                svgDiv.style.top = '50%';
            } else {
                svgDiv.style.top = '0%';
            }
        }
        console.log(svgDiv.style.width + ',' + svgDiv.style.height)
        panel.fireEvent('mousewheelChangeSize', {
            type: type,
            oldHeight: oldHeight,
            oldWidth: oldWidth,
            newHeight: changedHeight,
            newWidth: changedWidth,
            oldScrollTop: oldScrollTop,
            oldScrollLeft: oldScrollLeft,
            x: x,
            y: y
        });

    }
})
