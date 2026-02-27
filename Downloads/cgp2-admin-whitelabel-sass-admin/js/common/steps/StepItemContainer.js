/**
 * @Description:
 * @author nan
 * @date 2023/6/14
 */
Ext.Loader.syncRequire([
    'CGP.common.steps.StepItemV2',
])
Ext.define('CGP.common.steps.StepItemContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.step_item_container',
    stepItemV2Config: null,
    stepTitleConfig: null,
    layout: {
        type: 'vbox',
    },
    flex: 1,
    index: 0,
    status: 0,
    initComponent: function () {
        var me = this;
        if (me.layout == 'vbox' || me.layout.type == 'vbox') {
            me.layout = {
                type: 'vbox',
                align: 'center',
                pack: 'center'

            };
        } else {
            me.layout = {
                type: 'hbox',
                align: 'middle',
                pack: 'middle'
            };
        }
        this.addEvents(
            'itemClick',
            'statusChange'
        );
        me.items = [
            Ext.Object.merge({
                xtype: 'step_item_v2',
                itemId: 'stepItemV2',
                width: 35,
                margin: '5px',
                index: me.index,
                height: 35,
            }, me.stepItemV2Config),
            Ext.Object.merge({
                xtype: 'component',
                itemId: 'stepTitle',
                width: '100%',
                margin: '0 5',
                style: {
                    textAlign: 'center',
                },
                componentCls: 'auto-word-wrap-str',
                flex: 1,
            }, me.stepTitleConfig)
        ];
        me.callParent();
        //渲染转发stepItem的事件
        me.on('afterrender', function () {
            var me = this;
            var stepItemV2 = me.getComponent('stepItemV2');
            var stepTitle = me.getComponent('stepTitle');
            me.relayEvents(stepItemV2, ['itemClick', 'statusChange']);
            stepTitle.doComponentLayout();
            me.on('statusChange', function (stepItem, newValue, oldValue) {
                me.status = newValue;
            });
        });
    },
    /**
     *
     * @param text
     */
    updateTitle: function (text) {
        var me = this;
        var stepTitle = me.getComponent('stepTitle');
        stepTitle.el.dom.innerText = (text);
        stepTitle.doComponentLayout();
    },
    updateStatus: function (status) {
        var me = this;
        var stepItemV2 = me.getComponent('stepItemV2');
        stepItemV2.updateStatus(status);
        me.status = status;
    },
    setItemActive: function (isActive) {
        var me = this;
        var stepItemV2 = me.getComponent('stepItemV2');
        stepItemV2.setItemActive(isActive);
    }
})