/**
 * Created by nan on 2018/4/18.
 */
Ext.syncRequire(['CGP.configuration.managedeliveryaddress.store.DeliveryAddressStore'])
Ext.onReady(function () {
    var websiteId = JSGetQueryString('websiteId');
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
        items: [
            {
                itemId: 'btnAdd',
                text: i18n.getKey('add'),
                iconCls: 'icon_add',
                handler: function (view) {
                    var url=path + 'partials/config/editqpdeliveryaddress.html?createOrEdit=create&websiteId='+websiteId;
                    var editForm =tab.getComponent('editForm');
                    if(editForm){
                        tab.remove(editForm);
                    }
                    editForm=tab.add({
                        layout: 'fit',
                        itemId:'editForm',
                        closable:true,
                        title:i18n.getKey('create')+'_'+i18n.getKey('deliveryAddress'),
                        html: '<iframe id="tabs_iframe_' + "mail_template" + '" ' +
                            'src="' + url + '" width="100%" height="100%"' +
                            ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                            '</iframe>',
                        closeable: true
                    });
                    tab.setActiveTab(editForm);
                }
            }
        ]
    });
    var store = Ext.create('CGP.configuration.managedeliveryaddress.store.DeliveryAddressStore', {
        params: {
            filter: '[{"name":"websiteId","value":' + websiteId + ',"type":"number"}]'
        }
    });
    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        title: i18n.getKey('qp收货地址管理'),
        viewConfig:{
          enableTextSelection:true
        },
        columns: [
            {
                xtype: 'actioncolumn',
                width: 50,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                        tooltip: 'Edit',
                        handler: function (grid, rowIndex, colIndex, a, b, record) {
                            var recordId=record.get('_id');
                            var url=path + 'partials/config/editqpdeliveryaddress.html?createOrEdit=edit&websiteId='+websiteId+'&recordId='+recordId;
                            var editForm =tab.getComponent('editForm');
                            if(editForm){
                                tab.remove(editForm);
                            }
                            editForm=tab.add({
                                layout: 'fit',
                                itemId:'editForm',
                                closable:true,
                                title:i18n.getKey('compile')+'_'+i18n.getKey('deliveryAddress'),
                                html: '<iframe id="tabs_iframe_' + "mail_template" + '" ' +
                                    'src="' + url + '" width="100%" height="100%"' +
                                    ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                                    '</iframe>',
                                closeable: true
                            });
                            tab.setActiveTab(editForm);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.getStore();
                            var recordId = record.get('_id');
                            Ext.Msg.confirm('提示', '确定删除？', callback);
                            function callback(id) {
                                if (id === 'yes') {
                                    myMask.show();
                                    Ext.Ajax.request({
                                        url: adminPath + 'api/receiveAddresses/' + recordId,
                                        method: 'DELETE',
                                        headers: {
                                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                        },
                                        success: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            if (responseMessage.success) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                                myMask.hide();
                                                store.load();
                                            } else {
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            }
                                        },
                                        failure: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        }
                                    });
                                }
                            }
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('id'),
                dataIndex: '_id'
            },
            {
                text: i18n.getKey('name'),
                dataIndex: 'name'
            },
            {
                text: i18n.getKey('receiver'),
                dataIndex: 'address',
                renderer: function (value, metadata, record) {
                    value = value.firstName + value.lastName;
                    if (!value) {
                        return null;
                    } else {
                        
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value;
                    }
                }
            },
            {
                text: i18n.getKey('country'),
                dataIndex: 'address',
                renderer: function (value, metadata, record) {
                    value = value.countryName;
                    if (!value) {
                        return null;
                    }

                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return  value;
                }
            },
            {
                text: i18n.getKey('postCode'),
                dataIndex: 'address',
                renderer: function (value, metadata, record) {
                    value = value.postcode;
                    if (!value) {
                        return null;
                    } else {
                        
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value;
                    }
                }
            },
            {
                text: i18n.getKey('streetAddress1'),
                dataIndex: 'address',
                width:200,
                renderer: function (value, metadata, record) {
                    value = value.streetAddress1;
                    if (!value) {
                        return null;
                    } else {
                        
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value;
                    }
                }
            },
            {
                text: i18n.getKey('streetAddress2'),
                dataIndex: 'address',
                width:200,
                renderer: function (value, metadata, record) {
                    value = value.streetAddress2
                    if (!value) {
                        return null;
                    } else {
                        
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value;
                    }
                }
            },
            {
                text: i18n.getKey('telephone'),
                dataIndex: 'address',
                renderer: function (value, metadata, record) {
                    value = value.telephone;
                    if (!value) {
                        return null;
                    }
                    
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return  value;
                }
            },
            {
                text: i18n.getKey('emailAddress'),
                dataIndex: 'address',
                width:150,
                renderer: function (value, metadata, record) {
                    value = value.emailAddress;
                    if (!value) {
                        return null;
                    }
                    
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return  value;
                }
            }

        ],
        tbar: tbar,
        dockedItems: [
            {
                xtype: 'pagingtoolbar',
                store: store,
                dock: 'bottom',
                displayInfo: true
            }
        ]
    })
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var tab = Ext.create('Ext.tab.Panel',{
        id:'manageDeliveryAddressTab'
    });
    var myMask = new Ext.LoadMask(page, {msg: "Please wait..."});
    page.add(tab);
    tab.add(grid);
})
