/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.define('partner.productSupplier.view.OptionalConfigContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.optionalconfigcontainerv3',
    layout: 'vbox',
    name: null,
    state: null,//expand or collage
    title: null,
    status: null,
    titleFn: null,
    switchFn: null,
    containerItems: null,
    containerConfig: null,
    toolbarItems: null,
    allowBlank: true,
    initExpand: true,//初始化后是否展开
    errorInfoShow: false,
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
        var me = this;
        var color = {
            FINISHED: 'green',
            FAILURE: '#DC143C',
            RUNNING: '#1D7DA7',
            WAITING: '#999999'
        };
        me.color = color[me.status];
        var title = "<font style= 'color:" + me.color + ";font-weight: bold'>" + i18n.getKey(me.title) + '</font>';
        me.items = [
            {
                xtype: 'toolbar',
                color: 'black',
                width: '100%',
                bodyStyle: 'border-color:white;',
                border: '0 0 0 0',
                itemId: 'templateConfigToolBar',
                items: Ext.Array.merge([
                    {
                        xtype: 'button',
                        itemId: 'switchBtn',
                        iconCls: me.initExpand ? 'icon_spread' : 'icon_pack',
                        hidden: !me.allowBlank,
                        componentCls: 'btnOnlyIcon',
                        count: me.initExpand ? 0 : 1,
                        handler: me.switchFn || function () {
                            var btn = this;
                            var toolbar = this.ownerCt;
                            var outContainer = toolbar.ownerCt;
                            var container = outContainer.getComponent('container');
                            if (btn.count % 2) {
                                container.setDisabled(false);
                                container.show();
                                btn.setIconCls('icon_spread');
                            } else {
                                container.setDisabled(true);
                                container.hide();
                                btn.setIconCls('icon_pack');
                            }
                            btn.count++;
                        },
                        listeners: {
                            afterrender: function (comp) {
                                var me = comp.ownerCt.ownerCt;
                                var container = me.getComponent('container');
                                var items = container.items.items;
                                !items.length && comp.setVisible(false);
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: title,
                        componentCls: "btnOnlyIcon",
                        handler: me.titleFn || function () {
                            var toolbar = this.ownerCt;
                            var outContainer = toolbar.ownerCt;
                            var btn = toolbar.getComponent('switchBtn');
                            var container = outContainer.getComponent('container');
                            if (btn.count % 2) {
                                container.setDisabled(false);
                                container.show();
                                btn.setIconCls('icon_spread');
                            } else {
                                container.setDisabled(true);
                                container.hide();
                                btn.setIconCls('icon_pack');
                            }
                            btn.count++;
                        },
                    },
                ], me.toolbarItems)
            },
            Ext.Object.merge({
                xtype: 'container',
                itemId: 'container',
                name: 'container',
                width: '100%',
                disabled: me.initExpand ? false : true,
                hidden: me.initExpand ? false : true,
                layout: 'vbox',
                items: me.containerItems,
            }, me.containerConfig)
        ];
        me.callParent();
    }
})
