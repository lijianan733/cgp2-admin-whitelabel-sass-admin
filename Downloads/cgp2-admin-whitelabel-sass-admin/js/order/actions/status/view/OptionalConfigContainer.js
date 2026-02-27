/**
 * @author xiu
 * @date 2022/10/25
 */
Ext.define('Order.status.view.OptionalConfigContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.optionalconfigcontainerv2',
    containerConfig: null,
    containerItems: null,
    allowBlank: true,
    title: null,
    name: null,
    status: null,
    initExpand: true,//初始化后是否展开
    state: null,//expand or collage
    getValue: function () {
        var me = this;
        var container = me.getComponent('container');
        var toolbar = me.getComponent('templateConfigToolBar');
        var switchBtn = toolbar.getComponent('switchBtn');
        if (switchBtn.count % 2) {
            return null;
        } else {
            var result = container.getValue();
            return result;
        }
    },
    setValue: function (data) {
        var me = this;
        var container = me.getComponent('container');
        if (data) {
            var toolbar = me.getComponent('templateConfigToolBar');
            var switchBtn = toolbar.getComponent('switchBtn');
            switchBtn.count = 1;
            switchBtn.handler();
            container.setValue(data);
        }
    },
    isValid: function () {
        var me = this;
        var container = me.getComponent('container');
        return container.isValid();
    },
    getName: function () {
        return this.name;
    },
    getErrors: function () {
        var me = this;
        return '该输入项不允许为空'
    },
    getFieldLabel: function () {
        return this.title;
    },
    initComponent: function () {
        var title;
        var me = this;
        var color = {
            FINISHED: 'green',
            FAILURE: '#DC143C',
            RUNNING: '#999999',
            WAITING: '#999999'
        };
        me.color = color[me.status];
        title = "<font style= 'color:" + me.color + ";font-weight: bold'>" + i18n.getKey(me.title) + '</font>'
        me.items = [
            {
                xtype: 'toolbar',
                color: 'black',
                width: '100%',
                minWidth: 1200,
                bodyStyle: 'border-color:white;',
                border: '0 0 1 0',
                itemId: 'templateConfigToolBar',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: title
                    },
                    '->',
                    {
                        xtype: 'button',
                        itemId: 'switchBtn',
                        iconCls: me.initExpand ? 'icon_pack' : 'icon_spread',
                        count: me.initExpand ? 0 : 1,
                        hidden: !me.allowBlank,
                        componentCls: 'btnOnlyIcon',
                        handler: function () {
                            var btn = this;
                            var toolbar = this.ownerCt;
                            var outContainer = toolbar.ownerCt;
                            var container = outContainer.getComponent('container');
                            if (btn.count % 2) {
                                container.setDisabled(false);
                                container.show();
                                btn.setIconCls('icon_pack');
                            } else {
                                container.setDisabled(true);
                                container.hide();
                                btn.setIconCls('icon_spread');
                            }
                            btn.count++;
                        },
                    }
                ]
            },
            Ext.Object.merge({
                xtype: 'uxfieldcontainer',
                itemId: 'container',
                name: 'container',
                width: '100%',
                autoScroll: true,
                disabled: me.initExpand ? false : true,
                hidden: me.initExpand ? false : true,
                defaults: {
                    width: 500,
                    margin: '10 25 0 25',
                },
                layout: {
                    type: 'table',
                    columns: 2
                },
                items: me.containerItems
            }, me.containerConfig)
        ];
        me.callParent();
    }
})
