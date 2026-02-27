Ext.syncRequire([
    'CGP.ordersign.controller.Controller'
])
Ext.define('CGP.ordersign.view.batchsign.TopToolbar', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.top_toolbar',
    width: '100%',
    layout: 'hbox',
    margin: '5 0 0 0',
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'datetimefield',
                name: 'signDate',
                itemId: 'signDate',
                editable: false,
                format: 'Y-m-d H:i:s',
                value: new Date(),
                labelWidth: 70,
                fieldLabel: i18n.getKey('signDate')
            },
            {
                xtype: 'combobox',
                fieldLabel: i18n.getKey('signRemark'),
                name: 'SignRemark',
                itemId: 'signRemark',
                labelWidth: 70,
                value: '本人签收',
                store: new Ext.data.Store({
                    fields: ['name', 'value'],
                    data: [
                        {
                            name: '本人签收',
                            value: '本人签收'
                        },
                        {
                            name: '他人代收',
                            value: '他人代收'
                        },
                    ]
                }),
                displayField: 'name',
                valueField: 'value'
            },
            {
                xtype: 'button',
                text: i18n.getKey('batchSign'),
                iconCls: 'icon_batchSign',
                handler: function (btn) {
                    var result = {}, idGather = [],
                        me = btn.ownerCt,
                        grid = me.ownerCt,
                        dateField = me.getComponent('signDate'),
                        signField = me.getComponent('signRemark'),
                        time = dateField.getValue().getTime(),
                        sign = signField.getValue(),
                        selectData = grid.getSelectionModel().getSelection(),
                        url = adminPath + 'api/orders/batchUpdateStatus';

                    if(selectData.length === 0){
                        return Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择订单!'));
                    }

                    selectData.forEach(item => idGather.push(+item['data']['id']))

                    result = {
                        signDate: time,
                        signRemark: sign,
                        orderIds: idGather,
                        comment: '',
                        statusIds: 108,
                        customerNotify: false,
                    }

                    JSSetLoading(true)
                    JSAjaxRequest(url, 'PUT', false, result, null, function (require, success, response) {
                        JSSetLoading(false);
                        success && Ext.Msg.alert(
                            i18n.getKey('prompt'),
                            i18n.getKey('receive') + i18n.getKey('success'),
                            () => window.parent.Ext.getCmp('tabs').remove('batchSign')
                        );
                    })
                }
            },
        ];
        me.callParent();
    }
})