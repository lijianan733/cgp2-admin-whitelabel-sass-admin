/**
 * Main
 * @Author: miao
 * @Date: 2021/11/2
 */
Ext.define('CGP.returnorder.view.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.returnordermain',
    config: {
        i18nblock: i18n.getKey('returnorder'),
        block: 'returnorder/app/view',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,

        gridCfg: {
            editAction:false,
            deleteAction:false,
            store: 'ReturnRequestOrder',
            columns: [
                {
                    text: i18n.getKey('operation'),
                    dataIndex: '_id',
                    xtype: 'componentcolumn',
                    width: 100,
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            default: {
                                width: 100
                            },
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('modifyStatus'),
                                                disabledCls: 'menu-item-display-none',
                                                // disabled: !permissions.checkPermission('modifyStatus'),
                                                handler: function () {

                                                    JSOpen({
                                                        id: 'modifyReturnOrderStatus',
                                                        url: path + 'partials/returnorder/app/view/state/stateEdit.html?returnId=' + record.get('_id'),
                                                        title: i18n.getKey('returnOrder') + ' ' + i18n.getKey('modifyStatus'),
                                                        refresh: true
                                                    })

                                                }
                                            },
                                        ],
                                        listeners: {
                                            beforeshow: {
                                                fn: function (menu) {
                                                    menu.add(
                                                        [
                                                            // {
                                                            //     text: i18n.getKey('areaTax'),
                                                            //     disabledCls: 'menu-item-display-none',
                                                            //     itemId:'areaTax',
                                                            //     handler: function () {
                                                            //         // windows.
                                                            //         JSOpen({
                                                            //             id: 'areaTaxMain',
                                                            //             url: path + "partials/tax/app/view/areataxmain.html?id=" + record.get('_id')+"&countryId="+(record.get('area'))?.country?.id+"&countryName="+(record.get('area'))?.country?.name +"&souCountryId="+(record.get('rootAreaTax'))?.sourceArea?.country?.id+"&souCountryName="+(record.get('rootAreaTax'))?.sourceArea?.country?.name,
                                                            //             title:Ext.String.format('{0}({1}){2}', i18n.getKey('tax'),record.get('_id'),i18n.getKey('areaTax'))
                                                            //         });
                                                            //
                                                            //     }
                                                            // }
                                                        ]
                                                    );
                                                }, single: true
                                            }
                                        }
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('returnRequestOrderNo'),
                    dataIndex: 'returnRequestOrderNo',
                    xtype: 'gridcolumn',
                    width: 130,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    xtype: 'imagecolumn',
                    tdCls: 'vertical-middle',
                    width: 100,
                    dataIndex: 'thumbnail',
                    text: i18n.getKey('thumbnail'),
                    //订单的缩略图特殊位置
                    buildUrl: function (value, metadata, record) {
                        return projectThumbServer + value;
                    },
                    //订单的缩略图特殊位置
                    buildPreUrl: function (value, metadata, record) {
                        return projectThumbServer + value;
                    },
                    buildTitle: function (value, metadata, record) {
                        return i18n.getKey('check') + ` < ${value} > 预览图`;
                    },
                },
                {
                    text: i18n.getKey('product'),
                    dataIndex: 'productName',
                    xtype: 'componentcolumn',
                    width: 180,
                    renderer: function (value, metadata, record) {
                        var displayValue=Ext.String.format('<div>{0}:{1}</div><div>{2}:{3}</div>',i18n.getKey('productName'),record.get('productName'),i18n.getKey('sku'),record.get('sku'));
                        metadata.tdAttr =Ext.String.format( "data-qtip='{0}'",displayValue);
                        return {
                            xtype:'displayfield',
                            value:displayValue
                        };
                    }
                },
                {
                    text: i18n.getKey('salesReturn')+i18n.getKey('qty'),
                    dataIndex: 'qty',
                    xtype: 'gridcolumn',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('orderLineItem'),
                    dataIndex: 'orderItem',
                    xtype: 'componentcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        return {
                            xtype:'displayfield',
                            value:Ext.String.format('<div>{0}:{1}</div><div>{4}:{5}</div><div>{2}:{3}</div>',i18n.getKey('orderNo'),record.get('orderNo'),i18n.getKey('qty'),record.get('lineItemQty'),i18n.getKey('seqNo'),(record.get('orderItem'))?.seqNo)
                        };
                    }
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'currentState',
                    width: 120,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + (value?.state?.name||value?.state?.key) + '"';
                        return value?.state?.name||value?.state?.key;
                    }
                },
                {
                    text: i18n.getKey('applyDate'),
                    dataIndex: 'applyDate',
                    xtype: 'gridcolumn',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        if (Ext.isEmpty(value)) {
                            return
                        }
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                },
                {
                    text: i18n.getKey('reason'),
                    dataIndex: 'reason',
                    xtype: 'gridcolumn',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        var displayValue=value?.name;
                        metadata.tdAttr = 'data-qtip="' + displayValue + '"';
                        return displayValue;
                    }
                },
                {
                    text: i18n.getKey('applicant'),
                    dataIndex: 'user',
                    xtype: 'componentcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        var displayValue=Ext.String.format('<div>{0}:{1}</div><div>{2}:{3}</div>',i18n.getKey('username'),value?.firstName,i18n.getKey('email'),value?.emailAddress)
                        metadata.tdAttr = 'data-qtip="' + displayValue + '"';
                        return {
                            xtype:'displayfield',
                            value:displayValue
                        };
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
            ]
        },
        // 搜索框
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            defaults: {
                isLike: false
            },
            items: [
                // {
                //     name: '_id',
                //     xtype: 'textfield',
                //     fieldLabel: i18n.getKey('id'),
                //     hideTrigger: true,
                //     listeners: {
                //         render: function (comp) {
                //             var searchId = JSGetQueryString('returnorderId');
                //             if (searchId) {
                //                 comp.setValue(searchId);
                //             }
                //         }
                //     }
                // },
                {
                    name: 'returnRequestOrderNo',
                    xtype: 'textfield',
                    itemId: 'returnRequestOrderNo',
                    fieldLabel: i18n.getKey('returnRequestOrderNo')
                },
                {
                    name: 'currentState',
                    xtype: 'combobox',
                    itemId: 'status',
                    fieldLabel: i18n.getKey('status'),
                    displayField: 'displayName',
                    valueField: 'key',
                    value: '',
                    editable: false,
                    haveReset:true,
                    store: Ext.create('CGP.returnorder.store.StateNode',{
                        flowModule:'return_request_order'
                    })
                },
                {
                    name: 'reason._id',
                    xtype: 'combobox',
                    itemId: 'reason',
                    fieldLabel: i18n.getKey('reason'),
                    displayField: 'name',
                    valueField: '_id',
                    value: '',
                    editable: false,
                    haveReset:true,
                    store:Ext.create('CGP.returnorder.store.ReturnReason')
                },
                {
                    xtype: 'usercombo',
                    itemId: 'userSearch',
                    name: 'createdBy',
                    fieldLabel: i18n.getKey('applicant'),
                    displayField: 'firstName',
                    valueField: 'id',
                    valueType: 'id',
                    haveReset:true,
                    store: Ext.create('CGP.customer.store.CustomerStore'),
                },
                // {
                //     name: 'user',
                //     xtype: 'textfield',
                //     itemId: 'user',
                //     fieldLabel: i18n.getKey('user')
                // },
                {
                    id: 'datePurchasedSearch',
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'applyDate',
                    xtype: 'datefield',
                    itemId: 'fromDate',
                    scope: true,
                    fieldLabel: i18n.getKey('applyDate'),
                    width: 360,
                    format: 'Y/m/d'
                },
                {
                    name: 'orderNo',
                    xtype: 'textfield',
                    itemId: 'orderNo',
                    fieldLabel: i18n.getKey('orderNo')
                },
                {
                    name: 'productName',
                    xtype: 'textfield',
                    itemId: 'productName',
                    fieldLabel: i18n.getKey('productName')
                },
                {
                    name: 'sku',
                    xtype: 'textfield',
                    itemId: 'sku',
                    fieldLabel: i18n.getKey('sku')
                },
                {
                    name: 'configurableProductId',
                    xtype: 'numberfield',
                    itemId: 'configurableProductId',
                    fieldLabel: i18n.getKey('configurableProductId'),
                    hideTrigger:true
                },
            ]
        }
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
});