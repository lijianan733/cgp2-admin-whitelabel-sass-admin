/**
 * PushConfigData
 * @Author: miao
 * @Date: 2021/11/16
 */
Ext.define('CGP.tools.controller.PushConfigData', {
    extend: 'Ext.app.Controller',
    stores: [
        'PushConfigData'
    ],
    models: [
        'PushConfigData'
    ],
    views: [
        'PushConfigData'
    ],
    init: function () {
    },
    /**
     * 添加同步数据表
     * @param grid
     * @param record
     */
    addTable: function (grid, record) {
        var title = i18n.getKey('add') + i18n.getKey('data') + i18n.getKey('table');
        Ext.create('Ext.ux.window.SuperWindow', {
            title: title,
            height: 220,
            confirmHandler: function (btn) {
                var window = btn.ownerCt.ownerCt;
                var formComp = window.down('form');
                if (!formComp.isValid()) {
                    return false;
                }
                var data = formComp.getValues();
                grid.store.add(data);
                window.close();
            },
            items: [
                {
                    xtype: 'form',
                    itemId: 'wform',
                    border: 0,
                    fieldDefaults: {
                        labelAlign: 'right',
                        width: 380,
                        labelWidth: 100,
                        msgTarget: 'side'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'name',
                            name: 'name',
                            fieldLabel: i18n.getKey('name'),
                            allowBlank: false,
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'description',
                            name: 'description',
                            fieldLabel: i18n.getKey('description'),
                            allowBlank: false,
                        },

                    ],
                }]
        }).show();
    },
});