/**
 * Created by nan on 2017/12/26.
 */
Ext.define('CGP.partner.view.orderstatuschangenotifyconfig.view.HeadersContainer', {
    margin: '20 50 10 50',
    combineErrors: true,
    extend: 'Ext.form.FieldContainer',
    fieldDefaults: {
        hideLabel: true
    },
    layout: 'hbox',
    constructor: function (config) {
        var me = this;
        me.id = 'HeadersContainer' + config.count,
            me.items = [
                {
                    autoScoll: true,
                    width: 250,
                    itemId: 'key',
                    xtype: 'combo',
                    queryMode: 'local',
                    typeAhead: true,
                    name: 'key' + config.count,
                    displayField: 'key',
                    emptyText: '选择键名',
                    valueField: 'key',
                    store: config.store,
                    fieldLabel: i18n.getKey('key'),
                    allowBlank: false,
                    value: (config.record ? config.record.name : null)
                },
                {
                    xtype: 'label',
                    formId: 'value',
                    text: '=',
                    margin: '5 0 0 0 ',
                    style: {'text-align': 'center'},
                    width: 25
                },
                {
                    xtype: 'textfield',
                    itemId: 'value',
                    allowBlank: false,
                    name: 'value' + config.count,
                    width: 500,
                    value: (config.record ? config.record.value : null)
                },
                {
                    xtype: 'button',
                    margin: '0 0 0 10 ',
                    itemId: 'button',
                    tooltip: i18n.getKey('delete'),
                    cls: 'x-btn-default-toolbar-small',
                    iconCls: 'icon_remove icon_margin',
                    handler: function (button) {
                        var item = button.ownerCt;
                        button.ownerCt.ownerCt.remove(button.ownerCt);
                    }
                }
            ];
        me.callParent(arguments);
    }

})