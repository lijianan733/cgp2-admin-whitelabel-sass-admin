Ext.define('CGP.ordersign.view.ordersign.TopToolbar', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.top_toolbar',
    width: '100%',
    layout: 'hbox',
    margin: '5 0 0 0',
    orderId: null,
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
                name: 'signRemark',
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
                iconCls: 'icon_orderSign',
                text: '完成签收',
                handler: function (btn) {
                    var result = {},
                        shipmentInfo,
                        shipmentBoxes,
                        me = btn.ownerCt,
                        date = me.getComponent('signDate'),
                        time = date.getValue().getTime(),
                        signField = me.getComponent('signRemark'),
                        sign = signField.getValue(),
                        orderUrl = adminPath + 'api/orders/' + me.orderId + '/v2',
                        url = adminPath + 'api/orders/' + me.orderId + '/stateInstances';

                    JSSetLoading(true);
                    JSAjaxRequest(orderUrl, 'GET', false, result, null, function (require, success, response) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        success && ({shipmentInfo, shipmentBoxes} = responseText.data);
                    })

                    // 请求体格式
                    result = {
                        actionKey: 'RECEIVED_STATUS',
                        data: {
                            clazz: 'com.qpp.cgp.domain.entity.data.OrderStatusUpdateData',
                            statusId: 108,
                            typeSetting: {},
                            signDate: time,
                            signRemark: sign,
                            shipmentInfo: shipmentInfo,
                            shipmentBoxes: shipmentBoxes,
                        }
                    };
                    JSAjaxRequest(url, 'POST', false, result, null, function (require, success, response) {
                        JSSetLoading(false);
                        success && Ext.Msg.alert(
                            i18n.getKey('prompt'),
                            i18n.getKey('receive') + i18n.getKey('success'),
                            () => window.parent.Ext.getCmp('tabs').remove('orderSign')
                        );
                    })
                }
            },
        ];
        me.callParent();
    }
})