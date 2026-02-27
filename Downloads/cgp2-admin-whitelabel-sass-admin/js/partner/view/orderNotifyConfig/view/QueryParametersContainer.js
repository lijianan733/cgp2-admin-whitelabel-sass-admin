/**
 * Created by nan on 2017/12/26.
 */
Ext.define('CGP.partner.view.orderNotifyConfig.view.QueryParametersContainer', {
    margin: '20 50 10 50',
    combineErrors: true,
    extend: 'Ext.form.FieldContainer',
    fieldDefaults: {
        hideLabel: true
    },
    layout: 'hbox',
    constructor: function (config) {
        var me = this;
        me.id='QueryParametersContainer'+config.count;
        me.items= [
            {
                xtype: 'textfield',
                width: 250,
                itemId: 'key'+config.count ,
                allowBlank:false,
                name:'key'+config.count,
                value:(config.record ? config.record.name : null)
            },
            {
                xtype: 'label',
                formId: 'value' + config.count,
                text: '=',
                margin:'5 0 0 0 ',
                style: {'text-align': 'center'},
                width: 25
            },
            {
                xtype: 'textfield',
                itemId: 'value'+config.count ,
                width: 500,
                allowBlank:false,
                name:'value'+config.count,
                value:(config.record ? config.record.value : null)
            },
            {
                xtype: 'button',
                margin: '0 0 0 10 ',
                itemId: 'button',
                cls: 'x-btn-default-toolbar-small',
                iconCls: 'icon_remove icon_margin',
                handler: function (button) {
                    button.ownerCt.ownerCt.remove(button.ownerCt);
                }
            }
        ]
        me.callParent(arguments);
    }

})