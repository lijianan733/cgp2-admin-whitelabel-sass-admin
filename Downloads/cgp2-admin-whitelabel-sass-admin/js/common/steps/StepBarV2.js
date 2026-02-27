/**
 * @Description:
 * @author nan
 * @date 2023/6/14
 */
Ext.Loader.syncRequire([
    'CGP.common.steps.StepItemContainer',
    'CGP.common.steps.StepLine'
])
Ext.define('CGP.common.steps.StepBarV2', {
    extend: 'Ext.container.Container',
    alias: 'widget.step_bar_v2',
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'center'
    },
    direct: 'vbox',//指明item里面组件的排列方向和bar的布局方向相反
    stepLine: null,//步骤之间的连线
    activeItem: null,//当前活动对象
    stepItemDefault: null,//item默认配置
    stepItemContainerArr: null,
    allowItemClick: false,//是否允许切换节点
    allowClickChangeProcess: true,//点击节点切换进度
    process: 0,//进度
    initComponent: function () {
        var me = this;
        //me.direct和layout相反
        if (me.layout == 'vbox' || me.layout.type == 'vbox') {
            me.direct = 'hbox';
        } else if (me.layout == 'hbox' || me.layout.type == 'hbox') {
            me.direct = 'vbox';
        }
        me.items = [];

        me.stepItemContainerArr?.map(function (item, index, arr) {
            var stepItemContainer = Ext.Object.merge({
                xtype: 'step_item_container',
                flex: 1,
                height: '100%',
                layout: me.direct,
                index: index,
            }, me.stepItemDefault, item);
            if (arr.length == 1 && index == 0) {
                stepItemContainer.isShowLine = false;
            } else if (index == 0) {
                stepItemContainer.isShowLine = false;
            }
            me.items.push(stepItemContainer);
        });
        me.addEvents([
            'activeChange',//当前活动节点更改事件
            'itemClick',//点击节点事件
            'afterSetProcess'//设置完进度后触发事件
        ]);
        me.callParent();
        //转发各个组件的事件
        me.items.each(function (item) {
            me.relayEvents(item, ['itemClick']);
        });
        me.on('activeChange', function (newItem, oldItem) {
            var me = this;
            me.setItemActive(newItem);
        });
        //创建连接线
        me.on('boxready', function () {
            me.addStepLine();
        });
        //移动位置后重新定位
        me.on('afterlayout', function () {
            me.addStepLine();
        });
        me.on('itemClick', function (item) {
            var me = this;
            //是否允许切换进度
            if (me.allowClickChangeProcess) {
                me.setProcess(item.index, 1, 0);
            }
            if (me.allowItemClick) {
                me.setItemActive(item);
               ;
                me.fireEvent('activeChange', item, me.activeItem, me);
            }
        });
    },
    /**
     * 设置进度,未到达的状态为0；到达状态可为1||-1,已经到达状态为1
     * @param index
     * @param newStatus 当前进度的状态
     * @param oldStatus 未到达进度的状态
     */
    setProcess: function (index, newStatus, oldStatus) {
        var me = this;
        me.process = index < 0 ? 0 : (index > me.items.length ? me.items.length : index);
        me.items.each(function (item) {
            var count = item.index;
            if (count < me.process) {
                me.items.items[count].updateStatus(1);//默认已经完成的状态
            } else if (count == me.process) {
                me.items.items[count].updateStatus(newStatus);
            } else if (count > me.process) {
                me.items.items[count].updateStatus(0);//默认已经完成的状态
            }
        })
        me.fireEvent('afterSetProcess', me, me);
        me.setStepLineStyle();
    },
    /**
     * 根据进度状态，设置
     */
    setStepLineStyle: function () {
        var me = this;
        var direct = '';
        setTimeout(function () {
            if (me.layout == 'hbox' || me.layout.type == 'hbox') {
                direct = 'right';
                //水平
                var lineLength = me.stepLine.getWidth();
                var arr = [];
                me.items.each(function (item) {
                    var stepItem = item.el.query('[class*=step-icon-v2')[0];
                    var color = window.getComputedStyle(stepItem).color;
                    var position = item.getComponent('stepItemV2').getBox().x;
                    arr.push({color: color, position: position});
                });
            } else if (me.layout == 'vbox' || me.layout.type == 'vbox') {
                //垂直
                direct = 'bottom';
                var lineLength = me.stepLine.getHeight();
                var arr = [];
                me.items.each(function (item) {
                    var stepItem = item.el.query('[class*=step-icon-v2')[0];
                    var color = window.getComputedStyle(stepItem).color;
                    var position = item.getComponent('stepItemV2').getBox().y;
                    arr.push({color: color, position: position});
                });
            }
            //从第二个开始
            arr.map(function (item, index, arr) {
                if (index > 0) {
                    arr[index].position = (((arr[index].position - arr[0].position) / lineLength) * 100).toFixed(2) + '%';
                }
            });
            var newArr = [];
            arr[0].position = '0.00%';
            /**
             *         #30e8bf 33.3%,//起始颜色到33.3
             *         #2a6b7e 33.3%,
             *         #2a6b7e 66.6%,
             *         #ff8235 66.6%//终止颜色从 66.6开始
             */
            arr.map(function (item, index, arr) {
                if (index == 0) {
                    newArr.push(`${arr[index + 1].color} ${arr[index + 1].position}`);
                } else if (index == (arr.length - 1)) {
                } else {
                    newArr.push(`${arr[index + 1].color} ${item.position}`);
                    newArr.push(`${arr[index + 1].color} ${arr[index + 1].position}`);
                }
            });
            me.stepLine.el.dom.style.background = `linear-gradient(to ${direct} ,${newArr.join(',')})`;
        }, 100);

    },
    /**
     * 加上步骤连接线
     */
    addStepLine: function () {
        var me = this;
        var first = me.query('[itemId=stepItemV2]')[0];
        var last = me.query('[itemId=stepItemV2]').pop();
        var firstPosition = first.getBox();
        var lastPosition = last.getBox();
        var width = lastPosition.x - firstPosition.x;
        var height = lastPosition.y - firstPosition.y;
        var lineX = '';
        var lineY = '';
        var line = me.stepLine;
        var offsetParent = me.el.dom.offsetParent;//获取绝对布局所需要进行定位的上一级相对元素
        var offsetParentPosition = offsetParent.getBoundingClientRect();
        if (me.layout == 'hbox' || me.layout.type == 'hbox') {
            line = me.stepLine || Ext.widget('step_line', {
                style: {
                    position: 'absolute !important',
                    background: 'rgb(153, 153, 153)'
                },
                height: 2,
                itemId: 'step_line',
                renderTo: me.el.dom,
                width: width
            });
            lineX = firstPosition.x - offsetParentPosition.x;
            lineY = (firstPosition.top + ((firstPosition.bottom - firstPosition.top) / 2) - 2) - offsetParentPosition.y;
        } else if (me.layout == 'vbox' || me.layout.type == 'vbox') {
            line = me.stepLine || Ext.widget('step_line', {
                style: {
                    position: 'absolute !important',
                    background: 'rgb(153, 153, 153)'
                },
                height: height,
                itemId: 'step_line',
                renderTo: me.el.dom,
                width: 2
            });
            lineX = (firstPosition.left + ((firstPosition.right - firstPosition.left) / 2) - 2) - offsetParentPosition.x;
            lineY = firstPosition.y - offsetParentPosition.y;
        }
        line.setPosition(lineX, lineY);
        line.show();
        me.stepLine = line;
    },
    setItemActive: function (activeItem) {
        var me = this;
        me.items.each(function (item) {
            item.setItemActive(false);
        });
        me.activeItem = activeItem;
        activeItem.setItemActive(true);
    },
})