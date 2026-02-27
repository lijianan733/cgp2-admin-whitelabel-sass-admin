/**
 * 显示响应信息的窗口
 */
Ext.Loader.require('Ext.ux.data.proxy.PagingMemoryProxy');
Ext.define('CGP.cmspage.view.ResponseDataWin', {
    extend: 'Ext.window.Window',

    layout: 'fit',
    modal: true,
    width: 800,
    maxHeight: 500,
//    y: 300,
    id: 'createMsgWin',
    autoShow: true,
    initComponent: function () {
        var me = this;

        var cmspage = Ext.create('CGP.cmspage.store.CmsPage');

        var store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'pageId',
                    type: 'int'
                },
                {
                    name: 'productId',
                    type: 'int'
                },
                {
                    name: 'success',
                    type: 'boolean'
                },
                {
                    name: 'errMsg',
                    type: 'string'
                }
            ],
            pageSize: 25,
            autoLoad: true,
            proxy: Ext.create('Ext.ux.data.proxy.PagingMemoryProxy', { data: me.data, reader: {type: 'json'}})
        });
        var grid = Ext.create('Ext.grid.Panel', {
            header: false,
            //selType: 'checkboxmodel',
            store: store,
            viewConfig: {
                enableTextSelection: true
            },
            columns: [
                {
                    xtype: 'rownumberer',
                    autoSizeColumn: false,
                    itemId: 'rownumberer',
                    width: 45,
                    resizable: true,
                    menuDisabled: true,
                    tdCls: 'vertical-middle'
                },
                {
                    text: i18n.getKey('page'),
                    dataIndex: 'pageId',
                    xtype: 'componentcolumn',
                    itemId: 'pageName',
                    width: 150,
                    tdCls: 'vertical-middle',
                    sortable: true,
                    renderer: function (value, metadata) {
                        //var a = [{}]
                        var pageName = null;
                        var renderId = 'pageMsg' + Math.random().toString();
                        var component = {
                            id: renderId,
                            xtype: 'displayfield',
                            width: 150
                        }
                        var requestConfig = {

                            url: adminPath + 'api/cmsPages',
                            method: 'GET',
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            params: {
                                filter: "[{'name':'id','value': " + value + ",'type':'number'}]",
                                page: 1,
                                limit: 25
                            },
                            success: function (response) {

                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success) {
                                    if (!Ext.isEmpty(responseMessage.data.content)) {
                                        pageName = responseMessage.data.content[0].name;
                                        Ext.getCmp(renderId).setValue(i18n.getKey('pageName') + ': ' + pageName + '<br>' + i18n.getKey('pageId') + ': ' + value);
                                    } else {
                                        Ext.getCmp(renderId).setValue(i18n.getKey('pageId') + ': ' + value);
                                    }
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }

                            },
                            failure: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }

                        };
                        Ext.Ajax.request(requestConfig);

                        return component;
                    }
                },
                {
                    text: i18n.getKey('productMsg'),
                    dataIndex: 'productId',
                    xtype: 'componentcolumn',
                    itemId: 'productId',
                    width: 300,
                    sortable: false,
                    renderer: function (value) {
                        if (value == 0) {
                            return value = '空';
                        } else {
                            var productName = null;
                            var productSku = null;
                            var renderId = 'productMsg' + Math.random().toString();
                            var component = {
                                id: renderId,
                                xtype: 'displayfield',
                                widrh: 300
                            }
                            var requestConfig = {

                                url: adminPath + 'api/products',
                                method: 'GET',
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                params: {
                                    filter: "[{'name':'id','value': " + value + ",'type':'number'}]",
                                    page: 1,
                                    limit: 25
                                },
                                success: function (response) {

                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        if (!Ext.isEmpty(responseMessage.data.content)) {
                                            productName = responseMessage.data.content[0].name;
                                            productSku = responseMessage.data.content[0].sku;
                                            Ext.getCmp(renderId).setValue('id: ' + value + '<br>' + '产品名：' + productName + '<br>' + 'sku: ' + productSku);
                                        } else {
                                            Ext.getCmp(renderId).setValue('id: ' + value);
                                        }
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }

                            };
                            Ext.Ajax.request(requestConfig);

                            return component;
                        }
                    }
                },
                {
                    text: i18n.getKey('isSuccess'),
                    dataIndex: 'success',
                    xtype: 'gridcolumn',
                    itemId: 'success',
                    sortable: false,
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata) {
                        if (value == true) {
                            metadata.style = "color: green";
                            return value = '成功';
                        } else {
                            metadata.style = 'color: red';
                            return value = '失败'
                        }
                    }
                },
                {
                    text: i18n.getKey('errMsg'),
                    dataIndex: 'errMsg',
                    xtype: 'componentcolumn',
                    width: 180,
                    itemId: 'errMsg',
                    sortable: false,
                    renderer: function (value, metaData, record, rowIndex) {
                        if (Ext.isEmpty(value)) {

                        } else {
                            return new Ext.button.Button({
                                text: '<div style="color: #666666">' + i18n.getKey('errMsg') + '</div>',
                                frame: false,
                                width: 100,
                                style: {
                                    background: '#F5F5F5'
                                },
                                handler: function (comp) {

                                    var win = Ext.create("Ext.window.Window", {
                                        id: "errMsg",
                                        width: 500,
                                        height: 350,
                                        modal: true,
                                        autoScroll: true,
                                        title: i18n.getKey('errMsg'),
                                        html: value
                                    });
                                    win.show();
                                }

                            });
                        }
                    }

                }
            ]
        });
        //监听该window的关闭事件，关闭时清除对应window的数据
        me.listeners = {
            'close': function () {
                if (Ext.getCmp('productWin')) {
                    Ext.getCmp('productWin').getComponent('productList').recordArr.clear();
                    Ext.getCmp('productWin').getComponent('productList').collection.clear();
                    Ext.getCmp('productWin').getComponent('productList').down('form').reset();
                    Ext.getCmp('productWin').getComponent('productList').down('grid').getStore().loadPage(1);
                    //Ext.getCmp('productWin').destroy();
                } else if (Ext.getCmp('createPageWin')) {
                    Ext.getCmp('createPageWin').destroy();
                } else if (Ext.getCmp('websiteWin')) {
                    Ext.getCmp('websiteWin').destroy();
                } else {

                }
            }
        };
        me.title = i18n.getKey('productionMsg');
        me.bbar = [
            {
                xtype: 'pagingtoolbar',
                store: store,
                height: 30,
                id: 'responsepagingtoolbar',
                displayInfo: true,
                padding: '0,0,0,0',
                border: false
            }
        ];
        me.items = [grid];
        me.callParent(arguments);
    }
})