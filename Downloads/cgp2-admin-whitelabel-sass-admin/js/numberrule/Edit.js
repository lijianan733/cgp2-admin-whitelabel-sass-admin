/**
 * Created by nan on 2017/12/14.
 */
Ext.syncRequire([
    'CGP.numberrule.model.NumberRoleModel',
    'CGP.common.field.WebsiteCombo'
]);
Ext.onReady(function () {
    var websiteStore = Ext.create("CGP.currency.store.WebsiteAll");
    var id = JSGetQueryString('id');
    var createOrNew = Ext.isEmpty(id) ? 'new' : 'modify';
    var fieldStyle = (createOrNew == 'new' ? '' : 'background-color:silver');
    var page = Ext.widget({
        block: 'numberrule',
        xtype: 'uxeditpage',
        title: i18n.getKey('numberrule'),
        accessControl: true,
        gridPage: 'numberrulemanage.html',
        default: {
            allowBlank: false
        },
        formCfg: {
            model: 'CGP.numberrule.model.NumberRoleModel',
            remoteCfg: false,
            items: [
                {
                    name: 'format',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('format'),
                    itemId: 'format',
                    allowBlank: false
                },
                {
                    name: 'name',
                    xtype: 'combo',
                    editable: false,
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'name',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'name', type: 'string'}, {name: 'value', type: 'string'}
                        ],
                        data: [
                            {name: 'COUPON_NO', value: 'coupon_no'},
                            {name: 'ANONYMOUS_NO', value: 'anonymous_no'},
                            {name: 'ORDER_REDO_NO', value: 'order_redo_no'},
                            {name: 'ORDER_REPRINT_NO', value: 'order_reprint_no'},
                            {name: 'ORDER_REFUND_NO', value: 'order_refund_no'},
                            {name: 'ORDER_NUMBER', value: 'order_number'}
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'value',
                    allowBlank: false

                },
                {
                    name: 'website',
                    hidden: true,
                    xtype: 'websitecombo',
                    itemId: 'websiteCombo',
                    diyGetValue: function () {
                        var me = this;
                        return {
                            id: me.getValue(),
                            clazz: "com.qpp.cgp.domain.common.Website"
                        }
                    },
                    diySetValue: function (data) {
                        var me = this;
                        me.setValue(data.id);
                    }
                },
                {
                    name: 'serial',
                    xtype: 'textfield',
                    allowBlank: false,
                    editable: false,
                    fieldStyle: fieldStyle,
                    readOnly: (createOrNew == 'new' ? false : true),
                    fieldLabel: i18n.getKey('serialNumber'),
                    itemId: 'serial'
                },
                {
                    name: 'serialRegenBaseDay',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'value', type: 'int'}
                        ],
                        data: [
                            {name: 'true', value: 1},
                            {name: 'false', value: 0}
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'name',
                    fieldLabel: i18n.getKey('isSerialRegenBaseDay'),
                    itemId: 'serialRegenBaseDay',
                    allowBlank: false
                },
                {
                    name: 'smallest',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('smallest'),
                    itemId: 'smallest',
                    minValue: 1,
                    allowBlank: false,
                    hideTrigger: true
                },
                {
                    name: 'largest',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('largest'),
                    itemId: 'largest',
                    minValue: 0,
                    allowBlank: false,
                    hideTrigger: true

                }
            ]
        },
        listeners: {}
    });
});
