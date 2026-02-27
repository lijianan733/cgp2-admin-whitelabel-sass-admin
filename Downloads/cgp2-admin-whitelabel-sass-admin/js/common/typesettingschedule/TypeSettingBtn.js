Ext.Loader.syncRequire([
    'CGP.common.typesettingschedule.model.TypesettingScheduleModel',
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.view.TopStepBar',
    'CGP.common.typesettingschedule.view.MainStepBar',
    'CGP.common.typesettingschedule.store.LastTypesettingScheduleStore',
    'CGP.common.typesettingschedule.TypeSettingGrid'
])
Ext.define('CGP.common.typesettingschedule.TypeSettingBtn', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.typesettingbtn',
    storeId: null,
    orderNumber: null,
    record: null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'button',
                text: i18n.getKey('check') + i18n.getKey('typesettingschedule'),
                getName: Ext.emptyFn(),
                setValue: Ext.emptyFn(),
                getValue: Ext.emptyFn(),
                // margin: '5 5 10 0',
                handler: function () {
                    var store = Ext.create('CGP.common.typesettingschedule.store.LastTypesettingScheduleStore', {
                        params: {
                            filter: '[{"name":"orderNumber","value":"' + me.orderNumber + '","type":"string"}]',
                        }
                    });
                    Ext.create('CGP.common.typesettingschedule.TypeSettingGrid', {
                        record: me.record,
                        gridStore: store,
                        orderId: me.storeId,
                        statusId: me.statusId,
                        orderNumber: me.orderNumber
                    }).show();
                }
            }
        ]
        me.callParent(arguments)
    }
})
