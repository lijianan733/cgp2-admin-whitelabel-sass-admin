/**
 * 迭代，支持属性版本，支持选定mmvt
 * @author nan
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'partner.productSupplier.controller.Controller',
    'partner.productSupplier.view.GridWindow',
    'partner.productSupplier.view.SelectProductAndAttributeVersionWin'
])
Ext.define('partner.productSupplier.view.ProductOfManufactureV2', {
    extend: 'Ext.ux.form.GridFieldWithCRUDV2',
    alias: 'widget.product_of_manufacture_v2',
    actionEditHidden: true,
    controller: null,
    diySetValue: function () {

    },
    diyGetValue: function () {

    },
    initComponent: function () {
        var me = this;
        var partnerId = JSGetQueryString('partnerId');
        var websiteId = JSGetQueryString('websiteId');
        var controller = me.controller;
        var store = Ext.create('partner.productSupplier.store.ProductOfManufacturesStore', {
            proxy: {
                type: 'uxrest',
                url: adminPath + `api/productofmanufactures/partner/${partnerId}/v2`,
                reader: {
                    type: 'json',
                    root: 'data.content'
                }
            },
        });
        me.gridConfig = {
            autoScroll: true,
            store: store,
            selModel: {
                selType: 'checkboxmodel',
                multiselect: false,
                checkOnly: false,
                mode: "simple",//multi,simple,single；默认为多选multi
                allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
            },
            deleteHandler: function (view, rowIndex, colIndex, event, el, record) {
                var _id = record.get('_id');
                var grid = view.ownerCt;
                Ext.Msg.confirm('提示', '确认删除？', callback);

                function callback(id) {
                    if (id === 'yes') {
                        var url = adminPath + 'api/productofmanufactures/' + _id;
                        JSAjaxRequest(url, 'DELETE', true, null, i18n.getKey('deleteSuccess'), function (require, success, response) {
                            grid.store.load();
                        }, true)
                    }
                }

            },
            tbar: {
                border: false,
                btnRead: {
                    xtype: 'displayfield',
                    hidden: false,
                    disabled: false,
                    iconCls: null,
                    width: 120,
                    value: `<font style= 'color:green;font-weight: bold'> 可支持产品管理(v2) </font>`,
                },
                btnCreate: {
                    iconCls: 'icon_add',
                    text: i18n.getKey('添加产品'),
                    width: 85,
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        var manufactureIdv2 = me.controller.queryDataId;
                        if (me.controller.isPOST) {
                            var editPanel = btn.ownerCt.ownerCt.ownerCt.ownerCt;
                            var value = editPanel.diyGetValue();
                            var url = adminPath + 'api/manufactures';
                            JSSetLoading(true);
                            JSAjaxRequest(url, 'POST', false, value, false, function (require, success, response) {
                                JSSetLoading(false);
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    manufactureIdv2 = responseText.data._id;
                                    me.controller.isPOST = false;
                                    me.controller.queryDataId = manufactureIdv2;
                                    me.ownerCt.diySetValue(responseText.data);
                                }
                            })
                        }
                        var win = Ext.create('partner.productSupplier.view.SelectProductAndAttributeVersionWin', {
                            outGrid: grid,
                            manufactureIdv2: manufactureIdv2,
                            partnerId: partnerId,
                            websiteId: websiteId,
                        });
                        win.show();
                    }
                },
                btnDelete: {
                    xtype: 'button',
                    iconCls: 'icon_remove',
                    hidden: false,
                    disabled: false,
                    text: i18n.getKey('删除'),
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        var select = grid.getSelectionModel().getSelection();
                        select.length > 0 ? Ext.Msg.confirm('提示', '确认删除？', callback) : Ext.Msg.alert('提示', '请选择一条数据!');

                        function callback(id) {
                            if (id === 'yes') {
                                select.forEach(item => {
                                    var _id = item.data._id
                                    var url = adminPath + 'api/productofmanufactures/' + _id;
                                    JSAjaxRequest(url, 'DELETE', true, null, i18n.getKey('deleteSuccess'), function (require, success, response) {
                                        grid.store.load();
                                    }, true)
                                });
                            }
                        }
                    }
                }
            },
            columns: [
                {
                    xtype: 'rownumberer',
                    width: 40
                },
                {
                    xtype: 'atagcolumn',
                    minWidth: 120,
                    dataIndex: 'product',
                    align: 'center',
                    text: i18n.getKey('供应商产品配置'),
                    getDisplayName: function () {
                        return '<font color=blue style="text-decoration:underline">' + "<a>编辑</a>" + '</font>'
                    },
                    clickHandler: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var recordData = record.getData();
                        var productScope = record.get('productScope');
                        var versionedProductAttribute = productScope?.versionedProductAttribute;
                        var productId = record.get('product')._id;
                        me.controller.editSupplierProductConfigBtn(recordData, store, productId, versionedProductAttribute?._id);
                    }
                },
                {
                    dataIndex: 'status',
                    text: i18n.getKey('配置状态'),
                    renderer: function (value) {
                        var group = {
                            RELEASE: '上线',
                            TEST: '下线',
                            DRAFT: '草稿',
                        }
                        return group[value];
                    }
                },
                {
                    xtype: 'auto_bread_word_column',
                    width: 250,
                    dataIndex: 'product',
                    text: i18n.getKey('产品名称'),
                    renderer: function (value) {
                        return value['name'];
                    }
                },
                {
                    xtype: 'auto_bread_word_column',
                    width: 250,
                    dataIndex: 'versionedProductAttribute',
                    text: i18n.getKey('属性版本'),
                    renderer: function (value, metaData, record) {
                        var productScope = record.get('productScope');
                        if (productScope?.versionedProductAttribute) {
                            return 'version:' + productScope?.versionedProductAttribute?.version + `;描述：${productScope?.versionedProductAttribute?.remark}`
                        }
                    }
                },
                {
                    dataIndex: 'product',
                    text: i18n.getKey('产品编号'),
                    width: 120,
                    renderer: function (value) {
                        return value['_id'];
                    }
                },
                {
                    dataIndex: 'product',
                    text: i18n.getKey('产品类型'),
                    width: 120,
                    renderer: function (value) {
                        if(value['type']=='SKU'){
                            return "SKU产品"
                        }else{
                            return '可配置产品'
                        }
                    }
                },
                {
                    xtype: 'auto_bread_word_column',
                    flex: 1,
                    dataIndex: 'product',
                    text: i18n.getKey('产品型号'),
                    renderer: function (value) {
                        return value['model'];
                    }
                },
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: store
            }
        };
        me.callParent();
    }
})