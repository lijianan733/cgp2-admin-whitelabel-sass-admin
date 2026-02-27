Ext.onReady(function () {





    var model = Ext.define('CGP.model.PaymentMethod', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'websiteId',
            type: 'int'
        }, 'orderNumber', 'shippingMethod']
    })


    var page = Ext.widget({
        xtype: 'uxeditpage',
        formCfg: {
            bodyStyle: 'padding:30px',
            fieldDefaults: {
                labelAlign: 'right',
                style: 'margin: 10px',
                width: 350,
                msgTarget: 'side',
                labelWidth: 130,
                validateOnChange: false,
                plugins: [{
                    ptype: 'uxvalidation'
                }]
            },
            model: 'CGP.model.PaymentMethod',
            columnCount: 1,
            items: [{
                xtype: 'displayfield',
                name: 'orderNumber',
                itemId: 'orderNumber',
                fieldLabel: i18n.getKey('orderNo')
            }, {
                xtype: 'displayfield',
                name: 'shippingMethod',
                itemId: 'shippingMethod',
                fieldLabel: i18n.getKey('shippingMethod')
            }, {
                xtype: 'numberfield',
                name: 'xposition',
                itemId: 'xposition',
                fieldLabel: i18n.getKey('voacherReportXPosition'),
                allowDecimals: false,
                allowExponential: false,
                hideTrigger: true
            }, {
                xtype: 'numberfield',
                name: 'yposition',
                itemId: 'yposition',
                fieldLabel: i18n.getKey('voacherReportYPosition'),
                allowDecimals: false,
                allowExponential: false,
                hideTrigger: true
            }, {
                xtype: 'displayfield',
                value: '注: 单据报表X、Y坐标默认为0，每增加或减少0.1代表单据报表内容移动一个字符的位置' +
                    'X坐标值越大则报表内容向右移动， 反之， 向左移动' +
                    'Y坐标值越大则报表内容向下移动， 反之， 向上移动'
            }],
            tbar: [{
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save'
            }, {
                xtype: 'button',
                text: i18n.getKey('voacherInformation'),
                iconCls: 'icon_audit'
            }, {
                xtype: 'button',
                text: i18n.getKey('orderProductList'),
                iconCls: 'list-items'
            }, {
                xtype: 'button',
                text: i18n.getKey('grid'),
                iconCls: 'icon_grid',
                handler: function () {
                    JSOpen({
                        id: 'page',
                        url: path + 'partials/order/order.html',
                        title: i18n.getKey('order')
                    });
                }
            }]
        },
        listeners: {
            afterload: function (p) {
                var searcher = Ext.Object.fromQueryString(location.search);
                if (Ext.Object.isEmpty(searcher)) {
                    return;
                }

                var id = searcher.orderId;
                Ext.Ajax.request({
                    url: adminPath + 'api/orders/' + id,
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (response, options) {

                        var resp = Ext.JSON.decode(response.responseText);
                        if (!resp.success) {
                            Ext.Msg.alert(i18n.getKey('prompt'), resp.data.message);
                            return;
                        }
                        var data = new CGP.model.PaymentMethod(resp.data);
                        data.set('orderNumber', '<div class="status-field">' + data.get('orderNumber') + '</div>');
                        p.form.form.setValuesByModel(data);
                    },
                    failure: function (resp, options) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('serverError'));
                    }
                });
            }
        }
    });

});