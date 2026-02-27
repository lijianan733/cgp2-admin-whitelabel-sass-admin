/**
 * @author xiu
 * @date 2025/7/30
 */
/**
 * @author xiu
 * @date 2023/8/22
 */
//发货项
Ext.Loader.syncRequire([
    'CGP.orderitemsmultipleaddress.view.singleAddress.tool.splitBarTitle',
    'CGP.cmsconfig.view.DiyHtmlEditor'
])
Ext.define('CGP.websiteproductlist.view.CreateDefaultsConfig', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.defaults_config',
    bodyStyle: 'border-top:0;border-color:white;',
    margin: '5 0 25 0',
    defaults: {},
    order: null,
    readOnly: false,
    diyGetValue: function () {
        var me = this,
            result = {},
            container = me.getComponent('container'),
            items = container.items.items;

        items.forEach(item => {
            var {name} = item;
            if (name) {
                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
            }
        })

        return result;
    },
    diySetValue: function (data) {
        if (data) {
            var me = this,
                container = me.getComponent('container'),
                items = container.items.items;

            items.forEach(item => {
                var {name} = item;
                if (name) {
                    item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                }
            })
        }
    },
    initComponent: function () {
        const me = this,
            controller = Ext.create('CGP.websiteproductlist.controller.Controller'),
            title = '默认配置',
            splitBarTitle = me.readOnly ? title + JSCreateFont('red', true, ' (只读)', 15) : title;

        me.items = [
            {
                xtype: 'splitBarTitle',
                title: splitBarTitle,
            },
            {
                xtype: 'uxfieldcontainer',
                width: '100%',
                defaults: {},
                margin: '10 0 5 ',
                itemId: 'container',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'diy_html_editor',
                        fieldLabel: i18n.getKey('产品简述'),
                        name: 'shortDesc',
                        itemId: 'shortDesc',
                        width: '80%',
                        readOnly: me.readOnly,
                        extraBtn: [
                            {
                                xtype: 'button',
                                text: '同步CMS配置',
                                iconCls: 'icon_export',
                                disabled: me.readOnly,
                                handler: function (btn) {
                                    var field = btn.ownerCt.ownerCt.ownerCt
                                    controller.createImportCMSConfigWin(function (record) {
                                        field.diySetValue(record.get(field.name));
                                    });
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'diy_html_editor',
                        fieldLabel: i18n.getKey('产品描述'),
                        name: 'productDesc',
                        itemId: 'productDesc',
                        width: '80%',
                        readOnly: me.readOnly,
                        extraBtn: [
                            {
                                xtype: 'button',
                                text: '同步CMS配置',
                                iconCls: 'icon_export',
                                disabled: me.readOnly,
                                handler: function (btn) {
                                    var field = btn.ownerCt.ownerCt.ownerCt
                                    controller.createImportCMSConfigWin(function (record) {
                                        field.diySetValue(record.get(field.name));
                                    });
                                }
                            }
                        ]
                    }
                ]
            },
        ];
        me.callParent();
    },
})