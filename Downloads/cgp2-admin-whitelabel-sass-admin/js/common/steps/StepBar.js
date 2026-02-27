/**
 * @Description:
 * @author nan
 * @date 2022/6/6
 */
Ext.Loader.syncRequire([
    'CGP.common.steps.StepItems'
])
Ext.define('CGP.common.steps.StepBar', {
    extend: 'Ext.container.Container',
    alias: 'widget.stepbar',
    stepItemDefault: null,
    layout: 'hbox',
    direct: 'hbox',
    width: 800,
    margin: '5px 5px 0px 5px',
    activeItem: null,//当前的位置
    allowItemClick: false,//是否允许切换节点
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    setItemActive: function (activeItem) {
        var me = this;
        me.items.each(function (item) {
            item.setItemActive(false);
        });
        me.activeItem = activeItem;
        activeItem.setItemActive(true);
    },
    initComponent: function () {
        var me = this;
        if (me.direct == 'vbox') {
            me.layout = {
                type: 'vbox',
                pack: 'center',
                align: 'center '
            };
        }
        me.items = [];
        me.data?.map(function (item, index, arr) {
            var data = Ext.Object.merge({
                xtype: 'stepitems',
                flex: 1,
                direct: me.direct,
                index: index,
                isShowLine: true
            }, me.stepItemDefault, item);
            if (arr.length == 1 && index == 0) {
                data.isShowLine = false;
            } else if (index == 0) {
                data.isShowLine = false;
            }
            me.items.push(data);
        });
        me.addEvents([
            'activeChange',//当前活动节点更改事件
            'itemClick',//点击节点事件
            'afterSetProcess'//设置完进度后触发事件
        ]);
        me.callParent();
        me.items.each(function (item) {
            me.relayEvents(item, ['itemClick']);
        });

        me.on('itemClick', function (item) {
            var me = this;
            if (me.allowItemClick) {
                me.fireEvent('activeChange', item, me.activeItem, me);
                me.setProcess(item.index, 1);
            }
        });
        me.on('activeChange', function (newItem, oldItem) {
            var me = this;
            me.setItemActive(newItem);
        });
    },
    /**
     * 设置进度
     * @param index
     * @param newStatus 当前进度的状态
     * @param oldStatus 未到达进度的状态
     */
    setProcess: function (index, newStatus, oldStatus) {
        var me = this;
        me.items.each(function (item) {
            var count = item.index;
            if (count < index) {
                me.items.items[count].updateStatus(1);//默认已经完成的状态
            } else if (count == index) {
                me.items.items[count].updateStatus(newStatus);
            } else {
                me.items.items[count].updateStatus();//默认已经完成的状态
            }
        })
        me.fireEvent('afterSetProcess', me, me);
    }
})