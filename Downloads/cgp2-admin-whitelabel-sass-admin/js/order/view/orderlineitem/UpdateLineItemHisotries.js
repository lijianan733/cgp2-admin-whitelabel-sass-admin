Ext.define('CGP.order.view.orderlineitem.UpdateLineItemHisotries', {
    extend: "Ext.grid.Panel",
    //region: 'center',
    header: false,
    viewConfig: {
        enableTextSelection: true
    },


    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'modifyBy',
                    type: 'string'
                }, {
                    name: 'modifyBy',
                    type: 'string'
                }, {
                    name: 'date',
                    type: 'int'
                }, {
                    name: 'updateProductInstanceId',
                    type: 'string'
                }
            ],
            data: me.updateLineItemHisotries
        });
        me.dockedItems = [];
        /*me.dockedItems.push({
            xtype: 'pagingtoolbar',
            store: me.getStore(), // same store GridPanel is using
            dock: 'bottom',
            displayInfo: true,
            height: 40,
            inputItemWidth: 45,
            width: 500
        });*/
        me.columns = [
            {
                xtype: 'rownumberer',
                autoSizeColumn: false,
                itemId: 'rownumberer',
                flex: 0.05,
                height: 0,
                resizable: true,
                menuDisabled: true,
                tdCls: 'vertical-middle'
            },
            {
                text: false,
                dataIndex: 'modifyBy',
                //width: '100%',
                height: 0,
                flex: 0.95,
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    if (Ext.isEmpty(value)) {
                        return
                    }
                    var date = Ext.Date.format(new Date(record.get('date')), 'Y/m/d H:i:s');
                    var updateProductInstanceId = record.get('updateProductInstanceId');
                    metadata.style = 'font-size:16px';
                    //metadata.tdAttr = 'data-qtip="' + value + '"';
                    var template = '<div style="white-space:normal;">' + record.get('modifyBy') + '于' + '<font color=red>' + date + '</font>' + '修改订单项设计' + '<a style="text-decoration: none;" href="javascript:{handler}">' + '查看原设计' + '</a>' + '</div>'
                    return new Ext.Template(template).apply({
                        handler: 'checkProductInstance(' + updateProductInstanceId + ',' + '\'' + 'preview' + '\'' + ',\'' + me.orderLineItemId + '\'' + ')'
                    });
                    //return '<div style="white-space:normal;">' + '状态' +'于'+ '<font color=red>'+value +'</font>'+'修改为'+ '<font color=red>'+i18n.getKey(status) +'</font>'+'['+'备注：'+ '<font color=blue>'+remark +'</font>'+']'+'</div>'
                }
            }
        ];
        me.callParent();
        window.checkProductInstance = function (productInstanceId, editOrPreview, orderLineItemId) {
            var order = me.order;
            Ext.Ajax.request({
                url: adminPath + 'api/builder/resource/builder/url/latest' +
                    '?productInstanceId=' + productInstanceId + '&platform=PC&language=en',
                method: 'GET',
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (rep) {
                    var response = Ext.JSON.decode(rep.responseText);
                    if (response.success) {
                        if (Ext.isEmpty(response.data)) {
                            Ext.Msg.alert('提示', '产品无配置的builder地址。')
                        } else {
                            Ext.create('CGP.orderlineitem.view.manualuploaddoc.EditProductInstanceWindow', {
                                orderLineItemId: orderLineItemId,
                                productInstanceId: productInstanceId,
                                builderUrl: response.data,
                                order: order,
                                editOrPreview: editOrPreview
                            }).show();
                        }
                    } else {
                        Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        }
    }
});