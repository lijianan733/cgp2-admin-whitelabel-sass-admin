/**
 * @author xiu
 * @date 2024/12/6
 */
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.orderItemListV2', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.newOrderItemListV2',
    rowLines: true,//是否添加行边线
    columnLines: true,//是否添加列边线
    store: null,
    viewConfig: {
        stripeRows: false,
    },
    autoScroll: true,
    selModel: new Ext.selection.CheckboxModel(),
    maxHeight: 680,
    toolsHidden: false,
    manufactureCenterCoed: JSGetQueryString('manufactureCenter'),
    setManufactureCenterText: function (data) {
        var me = this,
            tools = me.getDockedItems('toolbar[dock="top"]')[0],
            manufactureCenterField = tools.getComponent('manufactureCenter');

        manufactureCenterField.setValue(JSCreateFont('red', true, `${data}`, 13));
    },
    initComponent: function () {
        var me = this,
            {manufactureCenterCoed} = me,
            permissions = ['AUTH_CHECKSTORERELATEDINFO_READ'],
            checkPermissions = '',
            isEditManufactureCenter = JSGetQueryString('isEditManufactureCenter') === 'true', //标记是否是修改生产基地页面
            mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            manufactureCenter = mainRenderer.getManufactureCenterText(manufactureCenterCoed)['text'];

        JSCheckPermission(permissions, function (resp) {
            var results = eval('(' + resp.responseText + ')').data;

            // 判断数组内是否全为true
            checkPermissions = results.every(result => result);
        }, false);

        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                //style: 'background-color:silver;',
                color: 'black',
                enableOverflow: true,
                bodyStyle: 'border-color:white;',
                border: '0 0 1 0',
                margin: '20 0 0 0',
                hidden: me.toolsHidden,
                itemId: 'infoDisplayToolbar',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        itemId: 'infoDisplay',
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('orderLineItem') + '</font>'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: JSCreateFont('red', true, `生产基地`, 13),
                        labelWidth: 60,
                        margin: '0 15 0 5',
                        itemId: 'manufactureCenter',
                        value: JSCreateFont('red', true, `${manufactureCenter + '生产基地'}`, 13)
                    },
                    {
                        text: i18n.getKey('切换全屏'),
                        iconCls: 'icon_expandAll',
                        handler: function (btn) {
                            JSCreateToggleFullscreenWindowGrid('orderLineItem', me, {
                                toolsHidden: true
                            });
                        }
                    },
                ]
            }
        ];

        me.columns = [
            {
                text: i18n.getKey('订单项序号'),
                dataIndex: 'seqNo',
                sortable: false,
                width: 120,
                align: 'center',  // 使内容居中
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    // 阻止单元格的点击事件
                    metaData.css = 'no-click-style'; // 添加自定义 CSS 类

                    // 返回单元格内容
                    return value;
                }
            },
            {
                xtype: 'componentcolumn',
                dataIndex: 'productImageUrl',
                text: i18n.getKey('image'),
                width: 140,
                sortable: false,
                align: 'center',  // 使内容居中
                renderer: function (value, metadata, record) {
                    var isComp = !!record.get('isComp'),
                        btnStatusGather = {
                            false: {
                                changeUserDesignBtn: false,
                                builderPageBtn: true,
                                customsCategoryBtn: false,
                                viewUserStuffBtn: false,
                                buildPreViewBtn: false,
                                contrastImgBtn: false,
                                builderCheckHistoryBtn: true
                            },
                            true: {
                                changeUserDesignBtn: false,
                                builderPageBtn: false,
                                customsCategoryBtn: false,
                                viewUserStuffBtn: false,
                                buildPreViewBtn: false,
                                contrastImgBtn: false,
                                builderCheckHistoryBtn: false
                            }
                        },
                        thumbnailInfo = record.get('thumbnailInfo'),
                        status = thumbnailInfo?.status,
                        thumbnail = thumbnailInfo?.thumbnail;

                    if (['', undefined].includes(thumbnail) && !['FAILURE', 'RUNNING'].includes(status)) {
                        status = 'NULL'
                    }

                    var statusGather = {
                        SUCCESS: function () {
                            return '查看图片';
                        },
                        FAILURE: function () {
                            return '图片生成失败';
                        },
                        RUNNING: function () {
                            return '图片正在生成中';
                        },
                        INIT: function () {
                            return '查看图片';
                        },
                        NULL: function () {
                            return '图片为空';
                        }
                    }
                    metadata.css = 'no-click-style'; // 添加自定义 CSS 类
                    metadata.tdAttr = `data-qtip=${statusGather[status]()}`
                    return mainRenderer.rendererImage(value, metadata, record, btnStatusGather[isComp], true, isComp);
                }
            },
            {
                xtype: 'atagcolumn',
                dataIndex: 'seqNo',
                text: i18n.getKey('product') + i18n.getKey('description'),
                // width: 320,
                minWidth: 200,
                flex: 1,
                sortable: false,
                align: 'center',  // 使内容居中
                getDisplayName: function (value, metadata, record) {
                    var isComp = !!record.get('isComp'),
                        productName = record.get('productName'),
                        description = record.get('description'),
                        productDescription = record.get('productDescription'),
                        result = null;

                    if (isComp) {
                        result = JSAutoWordWrapStr(JSCreateFont('#000000', true, description));
                    } else {
                        result = JSAutoWordWrapStr(JSCreateFont('#000000', true, productDescription || productName)) +
                            '\n<a href="#" data-qtip="产品属性" style="color: blue; font-weight: bold">查看产品属性</a>'
                    }

                    metadata.css = 'no-click-style'; // 添加自定义 CSS 类
                    return result
                },
                clickHandler: function (value, metadata, record) {
                    var orderItemId = record.get('_id');
                    var url = adminPath + `api/orderItems/${orderItemId}/productAttributeValues`;
                    JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
                        if (success) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            if (responseText.success) {
                                var data = responseText.data;
                                var store = Ext.create('Ext.data.Store', {
                                    fields: ['attributeName', 'attributeValue'],
                                    data: data
                                });
                                var win = Ext.create('Ext.window.Window', {
                                    title: i18n.getKey('查看产品属性'),
                                    modal: true,
                                    constrain: true,
                                    maxHeight: 550,
                                    minHeight: 250,
                                    width: 400,
                                    layout: 'fit',
                                    items: [{
                                        xtype: 'grid',
                                        header: false,
                                        store: store,
                                        columns: [
                                            {
                                                xtype: 'rownumberer'
                                            },
                                            {
                                                xtype: "auto_bread_word_column",

                                                text: i18n.getKey('属性名'),
                                                dataIndex: 'attributeName',
                                                flex: 1
                                            },
                                            {
                                                xtype: "auto_bread_word_column",
                                                dataIndex: 'attributeValue',
                                                text: i18n.getKey('值'),
                                                flex: 2
                                            }
                                        ]
                                    }]
                                });
                                win.show(null, function () {
                                    var win = this;
                                    setTimeout(function () {
                                        win.center();
                                    }, 100);
                                });
                            }
                        }
                    }, true);
                },
            },
            {
                dataIndex: 'qty',
                width: 150,
                text: i18n.getKey('qty'),
                sortable: false,
                align: 'center',  // 使内容居中
                renderer: function (value, metadata, record) {
                    metadata.css = 'no-click-style'; // 添加自定义 CSS 类
                    return JSCreateFont('#000000', true, value, 35);
                }
            },
            {
                text: i18n.getKey('product') + ' | ' + i18n.getKey('material'),
                dataIndex: 'seqNo',
                flex: 1,
                minWidth: 380,
                sortable: false,
                align: 'center',  // 使内容居中
                renderer: function (value, metadata, record) {
                    metadata.css = 'no-click-style'; // 添加自定义 CSS 类
                    var isComp = !!record.get('isComp'),
                        productName = record.get('productName'),
                        materialName = record.get('materialName'),
                        result = null;

                    if (isComp) {
                        result = materialName;
                    } else {
                        result = mainRenderer.renderProductInfo(productName, metadata, record)
                    }

                    return result;
                }
            },
            {
                xtype: 'atagcolumn',
                text: i18n.getKey('组件信息状态'),
                dataIndex: 'seqNo',
                sortable: false,
                width: 230,
                hidden: isEditManufactureCenter,
                align: 'center',  // 使内容居中
                getDisplayName: function (value, metadata, record) {
                    var componentInfoStatus = record.get('componentInfoStatus'),
                        isComp = !!record.get('isComp'),
                        result = '';

                    if (!isComp) {
                        var statusGather = {
                                WAITING: {
                                    color: 'orange',
                                    text: '等待执行',
                                },
                                FINISHED: {
                                    color: 'green',
                                    text: '执行完成',
                                },
                                SYNCING: {
                                    color: 'blue',
                                    text: '执行中',
                                },
                                EXECUTING: {
                                    color: 'blue',
                                    text: '执行中',
                                },
                                CANCELED: {
                                    color: 'gray',
                                    text: '已取消',
                                },
                                ERROR: {
                                    color: 'red',
                                    text: '执行失败',
                                    isRetry: true
                                },
                            },
                            {color, text, isRetry} = statusGather[componentInfoStatus];

                        result = JSCreateFont(color, true, text, 15);

                        if (isRetry) {
                            result = result + `  ${JSCreateHyperLink('重试')}`
                        }
                    }

                    metadata.css = 'no-click-style'; // 添加自定义 CSS 类
                    return result;
                },
                clickHandler: function (value, metaData, record, rowIndex, colIndex, store, view) {
                    var id = record.get('id'),
                        url = adminPath + `api/orderItemsV2/${id}/retry/component-infos`

                    mainRenderer.asyncEditQuery(url, {}, true, function (require, success, response) {
                        if (success) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            if (responseText.success) {
                                store.load();
                                Ext.Msg.alert('提示', '重试请求发起成功!');
                            } else {
                                Ext.Msg.alert('提示', '重试请求发起失败!');
                            }
                        }
                    })
                }
            },
            { //店铺订单信息
                text: i18n.getKey('店铺相关信息'),
                dataIndex: 'id',
                flex: 1,
                minWidth: 330,
                align: 'center',  // 使内容居中
                hidden: !checkPermissions, //有权限时显示
                renderer: function (value, metadata, record) {
                    metadata.css = 'no-click-style'; // 添加自定义 CSS 类
                    var bindSeqNo = record.get('bindSeqNo'),
                        bindOrderNumber = record.get('bindOrderNumber'),
                        storeName = record.get('storeName'),
                        storeProductId = record.get('storeProductId'),
                        infoGather = [
                            {
                                title: '店铺订单号',
                                value: bindOrderNumber ? `${bindOrderNumber}_${bindSeqNo}` : '',
                                isHideEmpty: true,  // 当value为空时隐藏该行
                            },
                            {
                                title: '店铺名称',
                                value: storeName,
                            },
                            {
                                title: '店铺编号',
                                value: storeProductId,
                            },
                        ]

                    return JSCreateHTMLTableV2(infoGather, 'right', 'auto', true);
                }
            },
        ]

        me.bbar = {
            xtype: 'pagingtoolbar',
            store: me.store,
            displayInfo: true, // 是否 ? 示， 分 ? 信息
            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
            emptyText: i18n.getKey('noDat')
        }

        me.callParent();
    },
})