/**
 * Created by nan on 2018/5/14.
 */
Ext.syncRequire(['CGP.builderpublishhistory.model.CustomerModel']);
Ext.onReady(function () {
    var store = Ext.create('CGP.builderpublishhistory.store.BuilderPublishHistroyStore');
    var a = 222;
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('builderpublishhistory'),
        block: 'builderpublishhistory',
        editPage: 'edit.html',
        tbarCfg: {
            hiddenButtons: [],//按钮的名称
            disabledButtons: ['create', 'delete']//按钮的名称44444444555
        },
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                width: 150
            },
            selType: 'rowmodel',
            editAction: false,//是否启用edit的按钮
            deleteAction: false,//是否启用delete的按钮
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id'
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'success',
                    itemId: 'success',
                    renderer: function (value, metadata, record) {
                        return value ? '成功' : '失败'

                    }
                },
                {
                    text: i18n.getKey('prePublishStatus'),
                    dataIndex: 'preStatus',
                    itemId: 'preStatus',
                    width: 200,
                    renderer: function (value, metadata, outrecord) {
                        switch (value) {
                            case 'UNCHANGED_NOTPUBLISH':
                            {
                                return '未更改，不发布'
                            }
                            case 'VERSIONCHANGED_NEEDPUBLISH':
                            {
                                return '版本已更改，需发布'
                            }
                            case 'VERSIONNOTCHANGED_NEEDPUBLISH':
                            {
                                return '版本未更改，需发布'
                            }
                            case 'CONTENTCHANGED_NOTPUBLISH':
                            {
                                return '内容已更改，不发布'
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('productConfigViewId'),
                    width: 200,
                    itemId: 'productConfigViewId',
                    dataIndex: 'productConfigViewId',
                    xtype: "componentcolumn",
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看productConfigView"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="color: blue" )>' + value + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                    var ela = Ext.fly(a);//获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        var productId = record.get('productId');
                                        var productConfigId = record.get('productConfigId');
                                        var openProductTab = function (productId, productConfigId) {
                                            Ext.Ajax.request({
                                                    url: adminPath + 'api/productConfigs/products/' + productId,
                                                    method: 'GET',
                                                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                                    success: function (res) {
                                                        var response = Ext.JSON.decode(res.responseText);
                                                        var success = response.success;
                                                        var productConfigId = response.data.id;
                                                        if (success == true) {
                                                            function openProductTab(productId, productConfigId) {
                                                                return JSOpen({
                                                                    id: 'productconfig',
                                                                    url: path + "partials/product/productconfig/productconfig.html?productId=" + productId + '&productConfigId=' + productConfigId + '&activeTab=' + 3 + '&viewConfigId=' + value,
                                                                    title: i18n.getKey('product') + i18n.getKey('config') + '(' + i18n.getKey('productCode') + ':' + productId + ')',
                                                                    refresh: true
                                                                });
                                                            }

                                                            openProductTab(productId, productConfigId);
                                                        } else {
                                                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                                        }
                                                    },
                                                    failure: function (resp) {
                                                        var response = Ext.JSON.decode(resp.responseText);
                                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                                    }
                                                }
                                            )
                                        };
                                        var tab = openProductTab(productId, productConfigId);
                                    });
                                }
                            }
                        };
                    }
                },
                {
                    text: i18n.getKey('productConfigViewVersion'),
                    dataIndex: 'productConfigViewVersion',
                    itemId: 'productConfigViewVersion',
                    width: 200

                },
                {
                    text: i18n.getKey('publishBy'),
                    dataIndex: 'publishBy',
                    itemId: 'publishBy',
                    renderer: function (value, metadata, outrecord) {
                        var returnValue = null;
                        Ext.Ajax.request({
                            url: adminPath + 'api/users/' + value,
                            method: 'GET',
                            async: false,
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                returnValue = responseMessage.data.email
                            },
                            failure: function (response) {
                                return null;
                            }
                        });
                        return returnValue
                    }
                },
                {
                    text: i18n.getKey('publishDate'),
                    dataIndex: 'publishDate',
                    itemId: 'publishDate',
                    renderer: function (value, metadata, record) {
                        metadata.style = "color: gray";
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                },
                {
                    text: i18n.getKey('language'),
                    dataIndex: 'language',
                    itemId: 'language'
                },
                {
                    text: i18n.getKey('message'),
                    dataIndex: 'message',
                    itemId: 'message',
                    width: 200
                }
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    isLike: false,
                    itemId: '_id'
                },
                {
                    name: 'preStatus',
                    xtype: 'combobox',
                    editable: false,
                    fieldLabel: i18n.getKey('prePublishStatus'),
                    itemId: 'preStatus',
                    store: new Ext.data.Store({
                        fields: ['name', 'value'],
                        data: [
                            {
                                name: '未更改，不发布',
                                value: 'UNCHANGED_NOTPUBLISH'
                            },
                            {
                                name: '版本已更改，需发布',
                                value: 'VERSIONCHANGED_NEEDPUBLISH'
                            },
                            {
                                name: '版本未更改，需发布',
                                value: 'VERSIONNOTCHANGED_NEEDPUBLISH'
                            },
                            {
                                name: '内容已更改，不发布',
                                value: 'CONTENTCHANGED_NOTPUBLISH'
                            }
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value'
                },
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'publishDate',
                    xtype: 'datefield',
                    itemId: 'publishDate',
                    scope: true,
                    fieldLabel: i18n.getKey('publishDate'),
                    width: 360,
                    format: 'Y/m/d'
                },
                {
                    name: 'success',
                    xtype: 'combobox',
                    editable: false,
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'success',
                    store: new Ext.data.Store({
                        fields: ['name', 'value'],
                        data: [
                            {
                                name: '成功',
                                value: true
                            },
                            {
                                name: '失败',
                                value: false
                            }
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value'
                }
            ]
        }

    });
});