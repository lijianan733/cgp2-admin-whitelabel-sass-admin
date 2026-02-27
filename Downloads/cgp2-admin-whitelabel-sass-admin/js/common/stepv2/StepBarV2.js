/**
 * @Description:
 * @author nan
 * @date 2023/6/14
 */
Ext.Loader.syncRequire([
    'CGP.common.stepv2.StepItemContainer',
    'CGP.common.stepv2.StepLine'
])
Ext.define('CGP.common.stepv2.StepBarV2', {
    extend: 'Ext.container.Container',
    alias: 'widget.step_bar_v2',
    autoScroll: true,

    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'center'
    },
    style: {
        position: 'relative'//必须要有，保证绝对布局的父元素就是当前组件
    },
    direct: 'vbox',//指明item里面组件的排列方向和bar的布局方向相反
    stepLine: null,//步骤之间的连线
    activeItem: null,//当前活动对象
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
                /*              flex: 1,
                              height: '100%',*/
                layout: me.direct,
                index: index,
            }, item);
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
                me.fireEvent('activeChange', item, me.activeItem, me);
            }
        });
    },
    /**
     * 设置进度,未到达的状态为0；到达状态可为1||-1||2;已经到达状态为1
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
        me.stepLine ? me.setStepLineStyle() : null;
    },
    /**
     * 根据进度状态，设置
     */
    setStepLineStyle: function () {
        var me = this;
        //在界面变化后获取变化后的颜色位置
        //linear-gradient(to right, rgb(64, 158, 255) 20%, rgb(247, 105, 0) 20%)
        setTimeout(function () {
            var process = me.process;
            var defaultColor = 'rgb(153, 153, 153)';
            var successColor = '#409eff';
            var stepItem = me.items.items[process];
            var first = me.items.items[0];
            if (me.layout == 'hbox' || me.layout.type == 'hbox') {
                //水平
                var lineLength = me.stepLine.getWidth();
                var length = stepItem.getComponent('stepItemV2').getBox().x - first.getComponent('stepItemV2').getBox().x;
                var position = ((length / lineLength) * 100).toFixed(2) + '%';
                var str = `linear-gradient(to right, ${successColor} ${position}, ${defaultColor} ${position})`;
                me.stepLine.el.dom.style.background = str;
            } else if (me.layout == 'vbox' || me.layout.type == 'vbox') {
                //垂直
                var lineLength = me.stepLine.getHeight();
                var length = stepItem.getComponent('stepItemV2').getBox().y - first.getComponent('stepItemV2').getBox().y;
                var position = ((length / lineLength) * 100).toFixed(2) + '%';
                var str = `linear-gradient(to bottom, ${successColor} ${position}, ${defaultColor} ${position})`;
                me.stepLine.el.dom.style.background = str;
            }
            //从第二个开始
        }, 150);

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
        if (me.layout == 'hbox' || me.layout.type == 'hbox') {
            if (me.stepLine) {
                line.setWidth(width);
            } else {
                line = Ext.widget('step_line', {
                    style: {
                        position: 'absolute !important',
                        background: 'rgb(153, 153, 153)'
                    },
                    height: 2,
                    itemId: 'step_line',
                    renderTo: me.el.dom,
                    width: width
                });
            }
        } else if (me.layout == 'vbox' || me.layout.type == 'vbox') {
            if (me.stepLine) {
                line.setHeight(height);
            } else {
                line = Ext.widget('step_line', {
                    style: {
                        position: 'absolute !important',
                        background: 'rgb(153, 153, 153)'
                    },
                    height: height,
                    itemId: 'step_line',
                    renderTo: me.el.dom,
                    width: 2
                });
            }
        }
        var offset = first.getOffsetsTo(me.el.dom);
        lineX = offset[0] + (first.getWidth() / 2) - 2;
        lineY = offset[1] + (first.getHeight() / 2);
        line.setPosition(Number(lineX), Number(lineY));
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