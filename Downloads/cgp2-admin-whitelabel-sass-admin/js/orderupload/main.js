Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items:[
            {
                xtype:'errorstrickform',
                id: 'uploadform',
                bodyStyle: {
                    padding: "5px",
                },
                name: '上传订单文档',
                formBind: true,
                defaults: {
                    width: 350
                },
                items: [
                    {
                        xtype: 'filefield',
                        name: 'file',
                        itemId: 'file',
                        allowBlank: false,
                        margin: '5px',
                        fieldLabel: '订单详情'
                    }, {
                        xtype: 'filefield',
                        name: 'listFile',
                        fieldLabel: '产品详情',
                        allowBlank: false,
                        itemId: 'listFile',
                        hidden: true
                    },
                    {
                        xtype: 'combobox',
                        store: Ext.create('CGP.common.store.Website'),
                        displayField: 'name',
                        valueField: 'id',
                        fieldLabel: '网站',
                        editable: false,
                        itemId: 'website',
                        value: 39
                    }, {
                        xtype: 'combobox',
                        store: Ext.create('CGP.orderupload.PlatformStore'),
                        displayField: 'name',
                        valueField: 'value',
                        fieldLabel: '选择平台',
                        editable: false,
                        allowBlank: false,
                        itemId: 'Platform',
                        listeners: {
                            change: function (combo) {
                                var platform = combo.getValue();
                                if (platform == 'YZ' || platform == 'MS') {
                                    this.ownerCt.getComponent('listFile').setVisible(false);
                                    this.ownerCt.getComponent('listFile').setDisabled(true);
                                } else if (platform == 'TB') {
                                    this.ownerCt.getComponent('listFile').setVisible(true);
                                    this.ownerCt.getComponent('listFile').setDisabled(false);
                                }
                            }
                        }
                    }
                ],
                tbar: [{
                    xtype: 'button',
                    text: "提交",
                    iconCls: 'icon_agree',
                    handler: function () {
                        var form = this.ownerCt.ownerCt;
                        var websiteId = form.getComponent('website').getValue();
                        var thirdPlatform = form.getComponent('Platform').getValue();
                        //将items转为htmlform
                        if (form.isValid()) {
                            var lm = form.setLoading(true);
                            form.getForm().submit({
                                url: adminPath + 'api/orders/' + websiteId + '/file?thirdPlatform=' + thirdPlatform + '&access_token=' + Ext.util.Cookies.get('token'),
                                success: function (form, action) {
                                    lm.hide();
                                    var response = action.response;
                                    if (response.success) {
                                        Ext.Msg.alert('提示', '上传成功');
                                        if (thirdPlatform == 'YZ') {
                                            JSOpen({
                                                id: 'page',
                                                refresh: true,
                                                title: '已审核（待捡货）',
                                                url: path + 'partials/order/order.html?statusId=114'
                                            });
                                        } else if (thirdPlatform == 'TB') {
                                            JSOpen({
                                                id: 'page',
                                                refresh: true,
                                                title: '待确认（第三方订单）',
                                                url: path + 'partials/order/order.html?statusId=300'
                                            });
                                        } else if (thirdPlatform == 'MS') {
                                            JSOpen({
                                                id: 'page',
                                                refresh: true,
                                                title: '等待付款',
                                                url: path + 'partials/order/order.html?statusId=100'
                                            });
                                        }
                                    } else {
                                        Ext.Msg.alert('Info', response.data.message);
                                    }
                                }
                            });
                        }

                    }
                }]
            }
        ]
    })
});